import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [form, setForm] = useState({ name: "", institution: "" });
  const [photo, setPhoto] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/api/me", { credentials: "include" }),
      fetch("http://localhost:5000/api/assessments", { credentials: "include" }),
    ]).then(async ([profileResponse, assessmentResponse]) => {
      if (profileResponse.ok) {
        const data = await profileResponse.json();
        setProfile(data.student);
        setForm({ name: data.student.name || "", institution: data.student.institution || "" });
        setPhoto(data.student.profilePhoto || "");
      }
      if (assessmentResponse.ok) {
        const data = await assessmentResponse.json();
        setAssessments(data.assessments || []);
      }
    }).catch(() => setStatus("Unable to load your profile right now."));
  }, []);

  const handlePhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setStatus("Please choose an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const maxDimension = 640;
        const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        let quality = 0.78;
        let compressed = canvas.toDataURL("image/jpeg", quality);
        while (compressed.length > 450_000 && quality > 0.45) {
          quality -= 0.08;
          compressed = canvas.toDataURL("image/jpeg", quality);
        }
        if (compressed.length > 450_000) {
          setStatus("This image could not be compressed enough. Please choose a simpler image.");
          return;
        }
        setPhoto(compressed);
        setStatus("Photo compressed and ready to save.");
      };
      image.onerror = () => setStatus("This image could not be read.");
      image.src = String(reader.result);
    };
    reader.onerror = () => setStatus("This image could not be read.");
    reader.readAsDataURL(file);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setStatus("Saving...");
    const response = await fetch("http://localhost:5000/api/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ ...form, profilePhoto: photo }),
    });
    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await response.json()
      : { message: "The image is too large for the server. Please choose another photo." };
    if (!response.ok) {
      setStatus(data.message || "Unable to save profile.");
      return;
    }
    setProfile(data.student);
    setStatus("Profile saved.");
  };

  const displayName = profile?.name || "Student";

  return (
    <div className="ps-page profile-page">
      <header className="ps-header">
        <div>
          <span className="ps-eyebrow">MY SPACE</span>
          <h1>Hey, <span>{displayName}.</span></h1>
          <p>Your profile, school details, and cognitive progress in one gentle space.</p>
        </div>
        <div className="ps-header-art" aria-hidden="true"><div className="ps-art-circle">A</div><span>✦</span><b>🌱</b></div>
      </header>

      <section className="profile-detail-card">
        <div className="profile-photo-wrap">
          {photo ? <img src={photo} alt={`${displayName} profile`} /> : <div className="profile-photo-placeholder">{displayName.charAt(0).toUpperCase()}</div>}
          <label className="profile-photo-button">
            Upload photo
            <input type="file" accept="image/*" onChange={handlePhoto} />
          </label>
        </div>
        <form className="profile-edit-form" onSubmit={handleSave}>
          <div className="profile-edit-heading"><span className="ps-card-label">YOUR DETAILS</span><h2>{displayName}'s profile</h2></div>
          <label>Student name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></label>
          <label>School or college<input value={form.institution} onChange={(event) => setForm({ ...form, institution: event.target.value })} required /></label>
          <div className="profile-meta"><span>Roll number</span><b>{profile?.rollNumber || "—"}</b></div>
          <button className="ps-support-button" type="submit">Save profile <span>→</span></button>
          {status && <p className="profile-status">{status}</p>}
        </form>
      </section>

      <section className="profile-cognitive-card">
        <div className="ps-section-heading"><div><span className="ps-card-label">COGNITIVE PROGRESS</span><h2>Your assessment results</h2></div><Link to="/app/cognitive-test" className="ps-text-button">Take another test →</Link></div>
        {assessments.length === 0 ? <p>No cognitive assessments yet. Your results will appear here after your first test.</p> : (
          <div className="profile-results-grid">{assessments.map((assessment) => <div className="profile-result" key={assessment.id}><strong>{assessment.score}%</strong><span>Class {assessment.grade} · {assessment.correctCount}/{assessment.questionCount} correct</span><small>{new Date(assessment.createdAt).toLocaleDateString()}</small></div>)}</div>
        )}
      </section>

      <section className="ps-support-strip"><div><span className="ps-card-label">NEED SUPPORT?</span><h2>You can always reach a real person too.</h2><p>Antarang is a wellbeing space, not a replacement for people who can support you directly.</p></div><Link to="/app/support" className="ps-support-button">See support options <span>→</span></Link></section>
    </div>
  );
}

export default Profile;
