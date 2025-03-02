import { api } from "@/trpc/react";
import { PlayerRole } from "@/lib/types";

export function FreeAgentAction(playerId: number, selectedId: number) {
  const { data: role } = api.gamestate.getRole.useQuery(selectedId);
  const { mutate: modifyRole } = api.gamestate.changeRole.useMutation();

  if (!role) {
    console.error("Could not find desired role: ", role);
  }

  modifyRole({ id: playerId, role: role! });
}

export function InfluencerAction() {
  const { data: player } = api.gamestate.getPlayerByRole.useQuery("influencer");
  return player;
}

export function DetectiveAction(selectedId: number) {
  const { data: role } = api.gamestate.getRole.useQuery(selectedId);
  return role;
}

export function VirusAction(
  playerId: number,
  currentRole: string,
  selectedId: number,
) {
  const { data: role } = api.gamestate.getRole.useQuery(selectedId);
  const { mutate: modifyRole } = api.gamestate.changeRole.useMutation();

  if (!role) {
    console.error("Could not find desired role: ", role);
  }

  modifyRole({ id: playerId, role: role! });
  modifyRole({ id: selectedId, role: currentRole });
}

export function HackerAction(firstSelectId: number, secondSelectedId: number) {
  const { data: role1 } = api.gamestate.getRole.useQuery(firstSelectId);
  const { data: role2 } = api.gamestate.getRole.useQuery(secondSelectedId);

  const { mutate: modifyRole } = api.gamestate.changeRole.useMutation();

  modifyRole({ id: firstSelectId, role: role2! });
  modifyRole({ id: secondSelectedId, role: role1! });
}

export function SkepticAction(playerId: number) {
  const { data: role } = api.gamestate.getRole.useQuery(playerId);

  return role;
}

export function CraziedAction(playerId: number) {
  let randomInt = Math.floor(Math.random() * 10);
  if (randomInt === 7) {
    randomInt = randomInt + 2;
  }

  const { mutate: modifyRole } = api.gamestate.changeRole.useMutation();

  modifyRole({
    id: playerId,
    role: Object.values(PlayerRole)[randomInt] as PlayerRole,
  });
}

export function SharedFateAction(selectedId: number) {
  const { mutate: killPlayer } = api.gamestate.removePlayer.useMutation();

  killPlayer(selectedId);
}
