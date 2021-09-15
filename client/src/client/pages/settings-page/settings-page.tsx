import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createGame } from '../../store/thunk';
import Settings from '../../components/settings/settings';
import Launch from '../../components/launch/launch';

export default function SettingsPage(): JSX.Element {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(createGame());
  }, []);

  const [settings, setSettings] = useState({
    gameName: '',
    isDealerInGame: false,
    isAutoEntry: false,
    isAutoFinish: false,
    isVoteMutable: false,
    estimationType: 'power2',
    isTimerRequired: false,
    timerValue: '00:01',
  });

  return (
    <div className="settings-page">
      <Settings settings={settings} setSettings={setSettings} />
      <hr />
      <Launch settings={settings} />
    </div>
  );
}