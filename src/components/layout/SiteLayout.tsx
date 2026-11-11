import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { RecruiterAssistant } from "../assistant/RecruiterAssistant";
import { pageSeo, siteOrigin } from "../../lib/seo";

function setMeta(
  selector: string,
  attribute: "name" | "property",
  key: string,
  value?: string,
) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!value) {
    element?.remove();
    return;
  }
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.append(element);
  }
  element.content = value;
}

export function SiteLayout() {
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const previousPath = useRef(pathname);
  useEffect(() => {
    const seo = pageSeo(pathname);
    const origin = siteOrigin(import.meta.env.VITE_SITE_URL);
    const canonical =
      origin && seo.known
        ? `${origin}${seo.path === "/" ? "/" : seo.path}`
        : undefined;
    document.title = seo.title;
    for (const name of ["description", "twitter:description"])
      setMeta(`meta[name="${name}"]`, "name", name, seo.description);
    setMeta(
      'meta[name="robots"]',
      "name",
      "robots",
      seo.known ? "index,follow" : "noindex,follow",
    );
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", seo.title);
    setMeta('meta[property="og:title"]', "property", "og:title", seo.title);
    setMeta(
      'meta[property="og:description"]',
      "property",
      "og:description",
      seo.description,
    );
    setMeta('meta[property="og:url"]', "property", "og:url", canonical);
    let link = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    if (canonical) {
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.append(link);
      }
      link.href = canonical;
    } else link?.remove();
    if (previousPath.current !== pathname) {
      window.scrollTo({ top: 0, behavior: "instant" });
      mainRef.current?.focus();
      previousPath.current = pathname;
    }
  }, [pathname]);
  return (
    <div className="flex min-h-svh flex-col">
      <a
        href="#main-content"
        className="absolute -top-24 left-6 z-50 rounded-lg bg-accent px-5 py-3 text-canvas focus:top-4"
      >
        Skip to content
      </a>
      <Navigation />
      <main
        id="main-content"
        ref={mainRef}
        tabIndex={-1}
        className="container-shell flex-1 pt-16 pb-8 outline-none sm:pt-24"
      >
        <Outlet />
      </main>
      <Footer />
      <RecruiterAssistant />
    </div>
  );
}
