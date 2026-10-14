import {
  useEffect,
  useRef,
  useState,
  type AnimationEvent,
} from "react";
import { aboutContent, type AboutLink, type AboutLogo } from "../data/about";
import { techIcons } from "../data/techIcons";

interface AboutWindowProps {
  open: boolean;
  spatial?: boolean;
  onClose: () => void;
}

function LogoMark({ logo }: { logo: AboutLogo }) {
  return (
    <li
      className="about-window__logo-mark"
      data-icon={logo.icon}
    >
      <img src={techIcons[logo.icon]} alt="" loading="lazy" />
      <span>{logo.label}</span>
    </li>
  );
}

function ContactIcon({ icon }: { icon: AboutLink["icon"] }) {
  if (icon === "mail")
    return (
      <path
        d="M3 6h18v12H3V6Zm1 1 8 6 8-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    );
  if (icon === "github")
    return (
      <path
        d="M12 2.8a9.2 9.2 0 0 0-2.9 17.9c.5.1.6-.2.6-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 0 1.6 1.1 1.6 1.1.9 1.6 2.4 1.1 3 .8.1-.7.4-1.1.7-1.3-2.2-.3-4.6-1.1-4.6-5a3.9 3.9 0 0 1 1-2.7c-.1-.3-.4-1.3.1-2.7 0 0 .9-.3 2.8 1.1a9.6 9.6 0 0 1 5.1 0c2-1.4 2.8-1.1 2.8-1.1.6 1.4.2 2.4.1 2.7a3.9 3.9 0 0 1 1 2.7c0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.8v2.6c0 .3.2.6.7.5A9.2 9.2 0 0 0 12 2.8Z"
        fill="currentColor"
      />
    );
  return (
    <>
      <rect x="4" y="9" width="4" height="11" />
      <circle cx="6" cy="5.5" r="2" />
      <path
        d="M12 20V9h4v1.7c.8-1.3 2-2 3.5-2 2.8 0 4.5 1.8 4.5 5.6V20h-4v-5.1c0-1.6-.6-2.6-2-2.6-1.5 0-2 1.1-2 2.6V20h-4Z"
        transform="translate(-2)"
      />
    </>
  );
}

export function AboutWindow({ open, onClose, spatial = false }: AboutWindowProps) {
  const [rendered, setRendered] = useState(open);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) setRendered(true);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const dialog = dialogRef.current;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialog) return;
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>("button, a[href]"),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previous?.focus();
    };
  }, [open, rendered, onClose]);

  const finishClosing = (event: AnimationEvent<HTMLDivElement>) => {
    if (!open && (event.animationName === "about-window-exit" || event.animationName === "profile-content-exit"))
      setRendered(false);
  };

  if (!rendered) return null;

  return (
    <div
      className="about-dialog"
      data-state={open ? "open" : "closing"}
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-title"
      ref={dialogRef}
    >
      {spatial && (
        <button className="profile-journey-back" type="button" onClick={onClose}>
          <span aria-hidden="true">←</span> Back to projects
        </button>
      )}
      <div
        className={spatial ? "about-window about-window--spatial" : "about-window"}
        data-state={open ? "open" : "closing"}
        onAnimationEnd={finishClosing}
      >
        <header className="about-window__header">
          <div className="about-window__identity">
            <h1 id="about-title">{aboutContent.name}</h1>
          </div>
          <button
            ref={closeRef}
            className="about-window__close"
            type="button"
            aria-label="Close About"
            onClick={onClose}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m7 7 10 10M17 7 7 17" />
            </svg>
          </button>
        </header>

        <div className="about-window__body">
          <section
            className="about-window__intro"
            aria-label="About me"
          >
            <p className="about-window__description">{aboutContent.description}</p>
          </section>
          <section className="about-window__contact" aria-label="Contact">
            <ul className="about-window__contact-list">
              {aboutContent.links.map((link) => (
                <li key={link.label}>
                  <a
                    className="about-window__contact-link"
                    data-icon={link.icon}
                    href={link.href}
                    aria-label={link.label}
                    target={link.icon === "mail" ? undefined : "_blank"}
                    rel={link.icon === "mail" ? undefined : "noopener noreferrer"}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <ContactIcon icon={link.icon} />
                    </svg>
                    <span>{link.label}</span>
                    <svg className="about-window__link-arrow" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M6 18 18 6M6 6h12v12" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section className="about-window__technologies" aria-label="Technologies">
            <ul className="about-window__logo-grid">
              {aboutContent.technologies.map((logo) => (
                <LogoMark key={logo.label} logo={logo} />
              ))}
            </ul>
          </section>

        </div>
      </div>
    </div>
  );
}
