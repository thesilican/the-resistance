import { RootState } from "..";

const socketID = (state: RootState) => state.client.socketID;

export const ClientSelector = { socketID };
