export type LobbyState = {
  id: string;
  // member[0] is host
  memberIDs: string[];
  names: string[];
  inGame: boolean;
};
