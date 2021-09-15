import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cancelGame, startGame } from '../../store/thunk';
import { IStore } from '../../store/types/store-types';

type Props = {
  settings:{
    gameName: string,
    isDealerInGame: boolean,
    isAutoEntry: boolean,
    isAutoFinish: boolean,
    isVoteMutable: boolean,
    estimationType: string,
    isTimerRequired: boolean,
    timerValue: string,
  }
};

export default function Launch({ settings }:Props): JSX.Element {
  const dispatch = useDispatch();

  const { id, name } = useSelector((state: IStore) => ({
    name: state.user.name,
    id: state.settings.id,
  }));

  const cancelGameHandler = () => {
    dispatch(cancelGame());
  };

  const startGameHandler = () => {
    dispatch(startGame(settings));
  };

  const copyLinkHandler = () => {
    navigator.clipboard.writeText(`http://localhost:3000/#/game/${id}`);
  };

  return (
    <div className="settings-page">
      <p>
        Room id:
        {id}
      </p>
      <p>
        Link to game:
        {`http://localhost:3000/#/game/${id}`}
      </p>
      <p>
        Your name:
        {name}
      </p>
      <button type="button" onClick={startGameHandler}>Start game</button>
      <button type="button" onClick={cancelGameHandler}>Cancel game</button>
      <button type="button" onClick={copyLinkHandler}>Copy link</button>

    </div>
  );
}
