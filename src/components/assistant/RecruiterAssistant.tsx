import { useEffect, useRef, useState } from "react";
import { Bot, Phone, PhoneOff, X } from "lucide-react";
import type { Conversation as VoiceSession } from "@elevenlabs/client";

// Public identifier of the existing Jacks agent; it is not an API key.
const agentId = "agent_0601m764ph7seear72jy00e9y5yk";
type CallState = "idle" | "connecting" | "listening" | "speaking" | "ending" | "error";

export function RecruiterAssistant() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<CallState>("idle");
  const [hasSession, setHasSession] = useState(false);
  const [message, setMessage] = useState("Start a conversation to ask about Anupom.");
  const launcher = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const session = useRef<VoiceSession | null>(null);
  const generation = useRef(0);
  const starting = useRef(false);

  const end = async () => {
    generation.current += 1;
    starting.current = false;
    const current = session.current;
    session.current = null;
    if (current) await current.endSession().catch(() => undefined);
  };

  const close = () => {
    setOpen(false);
    setHasSession(false);
    setState("idle");
    setMessage("Start a conversation to ask about Anupom.");
    void end();
    launcher.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    closeButton.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => () => { void end(); }, []);

  const start = async () => {
    if (starting.current || session.current) return;
    starting.current = true;
    const attempt = ++generation.current;
    setState("connecting");
    setMessage("Connecting… Please allow microphone access when prompted.");
    try {
      const { Conversation } = await import("@elevenlabs/client");
      if (generation.current !== attempt) return;
      const current = await Conversation.startSession({
        agentId,
        connectionType: "webrtc",
        onConnect: () => {
          if (generation.current === attempt) {
            setState("listening");
            setMessage("Connected. You can speak to Jacks.");
          }
        },
        onModeChange: ({ mode }) => {
          if (generation.current === attempt) {
            setState(mode === "speaking" ? "speaking" : "listening");
            setMessage(mode === "speaking" ? "Jacks is speaking." : "Listening. You can speak to Jacks.");
          }
        },
        onDisconnect: () => {
          if (generation.current === attempt) {
            generation.current += 1;
            starting.current = false;
            session.current = null;
            setHasSession(false);
            setState("idle");
            setMessage("The conversation ended. You can start another call.");
          }
        },
        onError: () => {
          if (generation.current === attempt) {
            if (session.current) setState("error");
            setMessage("Connection issue. End the call and try again, or use the email link below.");
          }
        },
      });
      if (generation.current !== attempt) {
        await current.endSession();
        return;
      }
      session.current = current;
      setHasSession(true);
    } catch (error) {
      if (generation.current === attempt) {
        setState("error");
        setMessage(error instanceof Error && (error.name === "NotAllowedError" || error.name === "PermissionDeniedError")
          ? "Microphone access was denied. Allow it in your browser settings and try again."
          : "Unable to connect. Check your microphone and connection, then try again.");
      }
    } finally {
      if (generation.current === attempt) starting.current = false;
    }
  };

  const stop = async () => {
    setState("ending");
    setMessage("Ending the conversation…");
    const stopGeneration = generation.current + 1;
    try { await end(); } finally {
      if (generation.current === stopGeneration) {
        setHasSession(false);
        setState("idle");
        setMessage("The conversation ended. You can start another call.");
      }
    }
  };

  return (
    <aside className="recruiter-widget" aria-label="Recruiter assistant">
      {open ? (
        <section id="recruiter-panel" className="recruiter-panel" role="dialog" aria-labelledby="recruiter-title">
          <header className="recruiter-panel-header">
            <div><p className="recruiter-kicker">MEET JACKS</p><h2 id="recruiter-title">Ask About Anupom</h2></div>
            <button ref={closeButton} type="button" className="recruiter-close" onClick={close} aria-label="Close assistant"><X size={20} /></button>
          </header>
          <div className="recruiter-panel-body">
            <img src="/assistant/jacks.jpg" alt="Illustration of a voice assistant" className="recruiter-art" />
            <p className="recruiter-intro">Ask Jacks about Anupom’s skills, projects and availability.</p>
            <p className="recruiter-status" role="status" aria-live="polite">{message}</p>
            {state === "idle" || (state === "error" && !hasSession) ? (
              <button type="button" className="button button-primary recruiter-call" onClick={() => void start()}><Phone size={17} aria-hidden="true" /> Start conversation</button>
            ) : (
              <button type="button" className="button button-secondary recruiter-call" onClick={() => void stop()} disabled={state === "ending"}><PhoneOff size={17} aria-hidden="true" /> {state === "ending" ? "Ending…" : "End conversation"}</button>
            )}
            <p className="recruiter-help">Jacks is an AI voice assistant. Allow microphone access to speak. <a href="mailto:anupommojumdernew@gmail.com">Email Anupom</a></p>
          </div>
        </section>
      ) : null}
      <div className="recruiter-launch-wrap">
        <span className="recruiter-label" id="recruiter-label"><Phone size={15} aria-hidden="true" /> Ask About Anupom <span className="recruiter-tap-hint">· Tap to talk</span></span>
        <button ref={launcher} type="button" className="recruiter-launcher" aria-label={open ? "Close Ask About Anupom" : "Ask About Anupom"} aria-expanded={open} aria-controls={open ? "recruiter-panel" : undefined} onClick={() => open ? close() : setOpen(true)}><Bot size={30} aria-hidden="true" /></button>
      </div>
    </aside>
  );
}
