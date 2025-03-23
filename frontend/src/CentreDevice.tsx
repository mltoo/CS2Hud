import React from 'react';
import * as weaponIcons from "url:../res/weapons/*.svg";
import * as generalIcons from 'url:../res/icons/*.svg';

export function CentreDevice(props) {
    const player = props.data;
    const isCT = player.team === 'CT';
    let bigGun: any = undefined;
    let pistol: any = undefined;
    let knife: any = undefined;
    let taser: any = undefined;
    let grenades: any[] = [];
    let hasBomb = false;
    let equipped: any = null;
    for (let weapon in player.weapons) {
        const weaponType = player.weapons[weapon].type;
        if (player.weapons[weapon].name === "weapon_taser") {
            taser = player.weapons[weapon];
        } else if (["Machine Gun", "Rifle", "Shotgun", "SniperRifle", "Submachine Gun"].includes(weaponType)) {
            bigGun = player.weapons[weapon];
        } else if (weaponType === "Pistol") {
            pistol = player.weapons[weapon];
        } else if (weaponType === "Knife") {
            knife = player.weapons[weapon];
        } else if (weaponType === "C4") {
            hasBomb = true;
        } else if (weaponType === "Grenade") {
            grenades.push(player.weapons[weapon]);
        }
        if (player.weapons[weapon].state == "active") {
            equipped = player.weapons[weapon];
        }
    }
    let primary: any = bigGun ?? pistol ?? knife;
    function weaponToIcon(weapon) {
        return weapon && weaponIcons[weapon.name.replace("weapon_", "")];
    }


    const boxSizing = "w-60 h-36"
    return <div className="fixed bottom-10 left-1/2 -translate-x-1/2">
        <div className='flex flex-row items-center'>
            <div className={`${boxSizing} p-3 flex flex-col justify-between ${isCT ? 'text-white' : 'text-black'}`}>
                <div className={`absolute left-0 top-0 rounded-xl -z-10 ${boxSizing} ${isCT ? 'bg-southLanPurple' : 'bg-southLanGreen'} opacity-60`} />
                <div className={`absolute left-0 top-0 -z-20 opacity-90 ${boxSizing}`} >
                    <div className='absolute left-0 top-0 overflow-clip' style={{ width: `${player.state.health}%` }}>
                        <div className={`rounded-xl ${boxSizing} ${isCT ? 'bg-southLanPurple' : 'bg-southLanGreen'}`} />
                    </div>
                </div>

                <div className='flex flex-col'>
                    <span className='text-2xl font-bold'>{player.name}</span>
                    <span className='text-green-600 font-bold text-lg'>${player.state.money}</span>
                </div>
                <div className='flex flex-col'>
                    <div className='flex flex-row items-baseline'>
                        <span className='text-xs font-normal mr-1'>K</span>
                        <span className='font-bold'>{player.match_stats.kills}</span>
                        <span className='text-xs font-normal ml-1.5 mr-1'>A</span>
                        <span className='font-bold'>{player.match_stats.assists}</span>
                        <span className='text-xs font-normal ml-1.5 mr-1'>D</span>
                        <span className='font-bold'>{player.match_stats.deaths}</span>
                    </div>
                    <div className='text-2xl font-bold -mt-1 flex flex-row items-center'>
                        <div className='bg-current w-[.5em] h-[.5em] mr-1' style={{ WebkitMask: `url(${generalIcons['health']}) no-repeat center/contain`, mask: `url(${generalIcons['health']}) no-repeat center/contain`}} />
                        {player.state.health}
                        {player.state.armor > 0 &&
                            <div className='bg-current w-[.6em] h-[.6em] ml-1 self-center' style={{ WebkitMask: `url(${generalIcons[player.state.helmet ? 'armor-helmet' : 'armor']}) no-repeat center/contain`, mask: `url(${generalIcons[player.state.helmet ? 'armor-helmet' : 'armor']}) no-repeat center/contain`}} />
                        }
                    </div>
                </div>
            </div>
            <div className='flex flex-col ml-3.5'>
                {player.state.health > 0 && <React.Fragment>
                <div className={`w-56 h-24 content-start`}><img className={`opacity-80 drop-shadow-lg absolute w-56 h-24`}  src={weaponToIcon(equipped)} /></div>
                <div className={`flex flex-row items-baseline text-white brightness-75 opacity-90`}>
                    <span className='font-bold text-3xl'>{equipped?.ammo_clip} </span>
                    <span className='pl-1 text-xl'>{equipped?.ammo_reserve} </span>
                    <span className='font-bold text-3xl text-transparent'>9</span>
                </div>
                </React.Fragment>}
            </div>
        </div>
    </div>
}
