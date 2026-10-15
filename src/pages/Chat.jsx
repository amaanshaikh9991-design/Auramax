import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../styles/Chat.css";

function Chat() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sessionId: urlSessionId } = useParams();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const [sessionId, setSessionId] = useState(
    urlSessionId ? Number(urlSessionId) : null
  );

  const [chatSessions, setChatSessions] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(false);

  // PDF upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [documents, setDocuments] = useState([]);

  // Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editingChatId, setEditingChatId] = useState(null);
  const [chatTitle, setChatTitle] = useState("");

  const suggestions = [
    "Help me study",
    "I'm feeling stressed",
    "I want to talk",
  ];

  const loadDocuments = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/documents",
        { credentials: "include" }
      );
      const body = await response.text();
      let data = {};
      try {
        data = JSON.parse(body);
      } catch {
        throw new Error(
          response.status === 404
            ? "The document API is not available. Restart the Antarang server."
            : "The document list response was invalid."
        );
      }
      if (!response.ok) {
        throw new Error(data.message || "Unable to load saved PDFs.");
      }
      if (response.ok) {
        setDocuments(data.documents || []);
      }
    } catch (error) {
      console.error("Document list error:", error);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  // =========================
  // INITIAL MESSAGE
  // =========================

  useEffect(() => {
    if (location.state?.initialMessage) {
      setMessage(location.state.initialMessage);

      navigate(location.pathname, {
        replace: true,
        state: {},
      });
    }
  }, [location, navigate]);

  // =========================
  // LOAD ALL CHAT SESSIONS
  // =========================

  useEffect(() => {
    const loadChatSessions = async () => {
      setLoadingSessions(true);

      try {
        const response = await fetch(
          "http://localhost:5000/api/chat/sessions",
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load chats."
          );
        }

        setChatSessions(data.sessions || []);
      } catch (error) {
        console.error(
          "Chat sessions error:",
          error
        );
      } finally {
        setLoadingSessions(false);
      }
    };

    loadChatSessions();
  }, []);

  // =========================
  // LOAD SELECTED CHAT
  // =========================

  useEffect(() => {
    if (!urlSessionId) {
      setSessionId(null);
      setMessages([]);
      return;
    }

    const loadChatHistory = async () => {
      setLoadingHistory(true);

      try {
        const response = await fetch(
          `http://localhost:5000/api/chat/${urlSessionId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load chat."
          );
        }

        setSessionId(data.sessionId);
        setMessages(data.messages || []);
      } catch (error) {
        console.error(
          "Chat history error:",
          error
        );

        setMessages([]);
      } finally {
        setLoadingHistory(false);
      }
    };

    loadChatHistory();
  }, [urlSessionId]);

  // =========================
  // NEW CHAT
  // =========================

  const handleNewChat = () => {
    setSessionId(null);
    setMessages([]);
    setMessage("");

    navigate("/app/chat");
  };

  // =========================
  // OPEN OLD CHAT
  // =========================

  const handleOpenChat = (id) => {
    navigate(`/app/chat/${id}`);
  };

  // =========================
  // RENAME CHAT
  // =========================

  const handleRenameChat = async (id) => {
    const title = chatTitle.trim();

    if (!title) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/chat/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            title,
          }),
        }
      );

      if (response.ok) {
        setChatSessions((previous) =>
          previous.map((chat) =>
            chat.id === id
              ? {
                  ...chat,
                  title,
                }
              : chat
          )
        );

        setEditingChatId(null);
      }
    } catch (error) {
      console.error(
        "Rename chat error:",
        error
      );
    }
  };

  // =========================
  // DELETE CHAT
  // =========================

  const handleDeleteChat = async (id) => {
    if (
      !window.confirm(
        "Delete this chat? This cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/chat/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        setChatSessions((previous) =>
          previous.filter(
            (chat) => chat.id !== id
          )
        );

        if (Number(urlSessionId) === id) {
          handleNewChat();
        }
      }
    } catch (error) {
      console.error(
        "Delete chat error:",
        error
      );
    }
  };

  // =========================
  // SUGGESTION
  // =========================

  const handleSuggestion = (text) => {
    setMessage(text);
  };

  // =========================
  // PDF UPLOAD
  // =========================

  const handlePdfUpload = async () => {
    if (!selectedFile || uploading) {
      return;
    }

    setUploading(true);
    setUploadMessage("");

    try {
      const formData = new FormData();

      formData.append("pdf", selectedFile);

      const response = await fetch(
        "http://localhost:5000/api/documents/upload",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          response.status === 413
            ? "This PDF is too large. Please upload a PDF smaller than 10 MB."
            : "The server returned an unexpected upload error."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message || "PDF upload failed."
        );
      }

      setUploadMessage(
        `✓ ${data.document?.filename || selectedFile.name} uploaded and remembered.`
      );

      console.log(
        "PDF extracted text:",
        data.preview
      );

      setSelectedFile(null);
      await loadDocuments();

      setMessage(
        `Explain "${data.document?.filename || selectedFile.name}" in simple language. Summarize the main ideas, important facts, and how this could help me as a student.`
      );
      await handleSubmit(
        { preventDefault: () => {} },
        `Explain "${data.document?.filename || selectedFile.name}" in simple language. Summarize the main ideas, important facts, and how this could help me as a student.`
      );
    } catch (error) {
      console.error(
        "PDF upload error:",
        error
      );

      setUploadMessage(
        error.message ||
          "Could not upload PDF."
      );
    } finally {
      setUploading(false);
    }
  };

  // =========================
  // SEND MESSAGE
  // =========================

  const handleSubmit = async (e, messageOverride = null) => {
    e.preventDefault();

    const userMessage = (messageOverride || message).trim();
    if (!userMessage || loading) {
      return;
    }

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            message: userMessage,
            sessionId: sessionId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Something went wrong."
        );
      }

      if (data.sessionId) {
        setSessionId(data.sessionId);

        // New chat → give it a permanent URL
        if (!sessionId) {
          navigate(
            `/app/chat/${data.sessionId}`,
            {
              replace: true,
            }
          );
        }
      }

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);

      // Refresh chat list
      const sessionsResponse =
        await fetch(
          "http://localhost:5000/api/chat/sessions",
          {
            method: "GET",
            credentials: "include",
          }
        );

      const sessionsData =
        await sessionsResponse.json();

      if (sessionsResponse.ok) {
        setChatSessions(
          sessionsData.sessions || []
        );
      }
    } catch (error) {
      console.error(
        "Chat error:",
        error
      );

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            "Sorry, I couldn't connect right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className={`chat-page ${
        sidebarOpen
          ? ""
          : "sidebar-closed"
      }`}
    >
      {/* =========================
          CHAT HISTORY SIDEBAR
      ========================= */}

      {sidebarOpen && (
        <aside className="chat-history">
          <div className="chat-history-header">
            <h2>Antarang AI</h2>

            <button
              className="new-chat-button"
              onClick={handleNewChat}
            >
              + New Chat
            </button>
          </div>

          <div className="chat-history-list">
            <p className="chat-history-title">
              Previous Chats
            </p>

            {loadingSessions && (
              <p className="chat-history-empty">
                Loading chats...
              </p>
            )}

            {!loadingSessions &&
              chatSessions.length === 0 && (
                <p className="chat-history-empty">
                  No previous chats yet.
                </p>
              )}

            {chatSessions.map((chat) => (
              <div
                className={`chat-history-row ${
                  Number(urlSessionId) ===
                  chat.id
                    ? "active"
                    : ""
                }`}
                key={chat.id}
              >
                {editingChatId ===
                chat.id ? (
                  <input
                    className="chat-rename-input"
                    value={chatTitle}
                    onChange={(event) =>
                      setChatTitle(
                        event.target.value
                      )
                    }
                    onKeyDown={(event) =>
                      event.key ===
                        "Enter" &&
                      handleRenameChat(
                        chat.id
                      )
                    }
                    autoFocus
                  />
                ) : (
                  <button
                    className="chat-history-item"
                    onClick={() =>
                      handleOpenChat(
                        chat.id
                      )
                    }
                  >
                    {chat.title ||
                      "New conversation"}
                  </button>
                )}

                <div className="chat-history-actions">
                  <button
                    aria-label="Rename chat"
                    onClick={() => {
                      setEditingChatId(
                        chat.id
                      );
                      setChatTitle(
                        chat.title || ""
                      );
                    }}
                  >
                    ✎
                  </button>

                  <button
                    aria-label="Delete chat"
                    onClick={() =>
                      handleDeleteChat(
                        chat.id
                      )
                    }
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </aside>
      )}

      {/* =========================
          MAIN CHAT
      ========================= */}

      <div className="chat-main">
        {/* HAMBURGER */}

        <button
          className="chat-sidebar-toggle"
          onClick={() =>
            setSidebarOpen(
              (previous) => !previous
            )
          }
          aria-label="Toggle chat history"
        >
          ☰
        </button>

        {/* =========================
            CHAT HEADER
        ========================= */}

        <div className="chat-header">
          <div>
            <p className="chat-eyebrow">
              YOUR LITTLE SPACE ✦
            </p>

            <h1>
              What's on
              <br />
              your mind?
            </h1>

            <p className="chat-subtitle">
              Talk, learn, reflect, or simply
              take a moment for yourself.
            </p>
          </div>

          {/* AI ACTIONS */}

          <div className="chat-ai-actions">
            <div className="chat-avatar">
              ✦
            </div>
          </div>
        </div>

        {/* PDF MESSAGE */}

        {uploadMessage && (
          <div className="pdf-upload-message">
            {uploadMessage}
          </div>
        )}

        {documents.length > 0 && (
          <div className="chat-document-memory">
            <strong>Your PDF memory</strong>
            <div className="chat-document-list">
              {documents.map((document) => (
                <span key={document.id} className="chat-document-chip">
                  📘 {document.filename}
                </span>
              ))}
            </div>
            <small>Ask Antarang AI about any uploaded document.</small>
          </div>
        )}

        {/* =========================
            CHAT CARD
        ========================= */}

        <section className="chat-card">
          {loadingHistory ? (
            <div className="chat-welcome">
              <div className="chat-bot-icon">
                ✦
              </div>

              <h2>
                Loading your chat...
              </h2>

              <p>
                Bringing your previous
                conversation back.
              </p>
            </div>
          ) : (
            <>
              {/* WELCOME */}

              {messages.length === 0 && (
                <div className="chat-welcome">
                  <div className="chat-bot-icon">
                    ✦
                  </div>

                  <h2>
                    Hey there 👋
                  </h2>

                  <p>
                    I'm Antarang AI. I'm
                    here whenever you need
                    a little space to talk or
                    think things through.
                  </p>
                </div>
              )}

              {/* MESSAGES */}

              {messages.length > 0 && (
                <div className="chat-messages">
                  {messages.map(
                    (msg, index) => (
                      <div
                        key={index}
                        className={`chat-message ${
                          msg.role ===
                          "user"
                            ? "user-message"
                            : "ai-message"
                        }`}
                      >
                        <div className="message-bubble">
                          {msg.content}
                        </div>
                      </div>
                    )
                  )}

                  {loading && (
                    <div className="chat-message ai-message">
                      <div className="message-bubble typing">
                        Antarang AI is
                        thinking...
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SUGGESTIONS */}

              {messages.length === 0 && (
                <div className="chat-suggestions">
                  {suggestions.map(
                    (suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() =>
                          handleSuggestion(
                            suggestion
                          )
                        }
                      >
                        {suggestion}
                      </button>
                    )
                  )}
                </div>
              )}

              {/* INPUT */}

              <form
                className="chat-input-area"
                onSubmit={handleSubmit}
              >
                <label className="pdf-upload-button">
                  📄 Add PDF
                  <input
                    type="file"
                    accept="application/pdf"
                    hidden
                    onChange={(e) => {
                      setSelectedFile(e.target.files[0] || null);
                      setUploadMessage("");
                    }}
                  />
                </label>

                {selectedFile && (
                  <button
                    type="button"
                    className="pdf-upload-submit"
                    onClick={handlePdfUpload}
                    disabled={uploading}
                  >
                    {uploading ? "Uploading..." : "Upload"}
                  </button>
                )}

                <input
                  type="text"
                  placeholder="Type something..."
                  value={message}
                  onChange={(e) =>
                    setMessage(
                      e.target.value
                    )
                  }
                  disabled={loading}
                />

                <button
                  type="submit"
                  className="chat-send"
                  disabled={loading}
                >
                  →
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default Chat;