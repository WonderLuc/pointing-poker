import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import axios from "axios";
import { IStore, IGame } from "../types";
import { UpdateSettings, setInitialStore } from "./actions";

const url = "http://localhost:5000/api";

export function createGame(settings: IGame) {
  return async (
    dispatch: ThunkDispatch<void, IStore, AnyAction>,
    getState: () => IStore
  ): Promise<void> => {
    try {
      const { user } = getState();
      const response = await axios.post(`${url}/newGame`, {
        userName: user.name,
        settings,
      });
      if (response.status === 200) {
        console.log(response.data);
        dispatch(
          UpdateSettings({
            settings: response.data.settings,
            isActive: false,
            id: response.data.id,
          })
        );
      }
    } catch (e) {
      console.log(e);
    }
  };
}

export function cancelGame() {
  return async (
    dispatch: ThunkDispatch<void, IStore, AnyAction>,
    getState: () => IStore
  ): Promise<void> => {
    try {
      const { game } = getState();
      const response = await axios.post(`${url}/removeGame`, { id: game.id });
      if (response.status === 200) {
        dispatch(setInitialStore());
      }
    } catch (e) {
      console.log(e);
    }
  };
}

export function activitySwitcher(isActive: boolean) {
  return async (
    dispatch: ThunkDispatch<void, IStore, AnyAction>,
    getState: () => IStore
  ): Promise<void> => {
    try {
      const { game } = getState();
      const response = await axios.post(`${url}/changeGameActivity`, {
        id: game.id,
        isActive,
      });
      if (response.status === 200) {
        dispatch(UpdateSettings({ isActive: response.data }));
      }
    } catch (e) {
      console.log(e);
    }
  };
}

export function updateSettings(settings: IGame) {
  return async (
    dispatch: ThunkDispatch<void, IStore, AnyAction>,
    getState: () => IStore
  ): Promise<void> => {
    try {
      const { game } = getState();
      const response = await axios.post(`${url}/updateSettings`, {
        id: game.id,
        settings,
      });
      if (response.status === 200) {
        dispatch(UpdateSettings(response.data));
      }
    } catch (e) {
      console.log(e);
    }
  };
}

export async function isGameActive(id: string) {
  // return async (): Promise<void> => {
  try {
    // const { user } = getState();
    const response = await axios.post(`${url}/checkedIdKey`, { id });
    if (response.status === 200) {
      return response.data;
      // dispatch(UpdateSettings({ settings: response.data.settings, isActive: false, id: response.data.id }));
    }
  } catch (e) {
    console.log(e);
  }
}


