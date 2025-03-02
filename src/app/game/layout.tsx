import GameStateProvider from "./_components/provider";

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GameStateProvider>{children}</GameStateProvider>;
}
