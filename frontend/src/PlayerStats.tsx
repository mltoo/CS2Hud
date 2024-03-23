import React, { useState, useEffect } from 'react';
import { PlayerBar } from './PlayerBar';

export function PlayerStats(props) {
    const players: object[] = (Object.keys(props.data ?? {} as object) as string[]).map(steamID => { return { 'steamid': steamID, ...props.data[steamID] } })
    const mappedPlayers = {}
    for (let player in players) {
        players[player]['observer_slot'] != undefined && (mappedPlayers[players[player]['observer_slot']] = players[player]);
    }
    const arrangedPlayers : object[] = []
    for (let i = 0; i < 10; i++) {
        arrangedPlayers.push(mappedPlayers[Math.floor((i / 2) + (i%2)*5)] ?? {'observer_slot': Math.floor((i / 2) + (i%2)*4)});
    }


    return <div className="grid grid-cols-2 grid-rows-5 w-screen absolute bottom-0 overflow-clip">
        {arrangedPlayers.map((player: any) => player['name'] ? <PlayerBar key={player.observer_slot} data={player} round={props.round} roundPhase={props.roundPhase} roundDamage={props.roundDamage} isSpecced={props.currentSpec['steamid'] === player['steamid']}/> : <div/>)
        }
    </div>
}

