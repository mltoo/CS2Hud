import React, { useState, useEffect } from 'react';
import { PlayerBar } from './PlayerBar';

export function PlayerStats(props) {
    const players: object[] = (Object.keys(props.data ?? {} as object) as string[]).map(steamID => { return { 'steamid': steamID, ...props.data[steamID] } }).sort(
        (playerA: any, playerB: any) =>
            ((playerA.observer_slot % 5) + (playerA.observer_slot / 10)) -
            ((playerB.observer_slot % 5) + (playerB.observer_slot / 10)));

    return <div className="grid grid-cols-2 grid-rows-5 w-screen absolute bottom-0 overflow-clip">
        {players.map((player: any) => <PlayerBar key={player.observer_slot} data={player} round={props.round} roundPhase={props.roundPhase} roundDamage={props.roundDamage} />)
        }
    </div>
}

