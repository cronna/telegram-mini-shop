import type { Route } from "./+types/home";
import { useEffect } from 'react';
import { Welcome } from "../welcome/welcome";
import { initTelegramUI } from "../lib/telegram-init";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Mini Shop" },
    { name: "description", content: "Telegram Mini Shop demo" },
  ];
}

export default function Home() {
  useEffect(() => { initTelegramUI(); }, []);
  return <Welcome />;
}
