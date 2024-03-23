import React, { useEffect, useState } from 'react';
import '../pngImport.d'
import monster from 'url:../res/monster.png'
import intel from 'url:../res/intel.png'
import nse from 'url:../res/nse.png'
import ue from 'url:../res/ue.png'

export function SponsorBlock(props) {
    const barHeight = 80;
    const barLength = 300
    const dydx = -0.37388513540873675;
    const [index, setIndex] = useState(0);
    const [activeLogoIndex, setActiveLogoIndex] = useState(0);
    React.useEffect(() => {
    const timerId = setInterval(
      () => setIndex((i) => (i + 1) % 3), // <-- increment index
      2000
    );
    return () => clearInterval(timerId);
  }, []);

  React.useEffect(() => {
    setActiveLogoIndex(index); // <-- update media state when index updates
  }, [index]);
    console.log(activeLogoIndex);
    let activeLogo = 'monster';
    console.log(index);
    switch(index) {
        case 0:
        activeLogo = 'monster';
        break;
        case 1: 
        activeLogo = 'intel';
        break;
        case 2:
        activeLogo = 'nse';
        break;
        case 3:
        activeLogo = 'ue';
        break;
    }
    return <div className='justify-self-end' style={{width:`${barLength}px`, height: `${barHeight}px`}} >
        <svg
            className='absolute -z-10'
            height={barHeight}
            viewBox={"0 0 " + barLength + " " + barHeight}
        >
            <defs id="defs1">
                <linearGradient id={"sponsorgrad"}>
                    <stop stopColor='black' stopOpacity="0%" offset="40%" />
                    <stop className='transition' stopColor={'black'} stopOpacity={"100%"} offset="100%" />
                </linearGradient>
            </defs>
            <g id="layer1">
                <path
                    fill={"url(#sponsorgrad)"}
                    x="0"
                    y="0"
                    d={"m " + barLength + " " + 0 +
                        " " + dydx * barHeight + " " + barHeight
                        + " h " + -barLength
                        + " v " + -barHeight
                        //+ " l " + -dydx * barHeight + " " + barHeight
                        }
                        //}
                />
                <path
                    className='fill-southLanGreen'
                    d={"m " + barLength + " " + 0 +
                        " " + dydx * barHeight + " " + barHeight
                        + " h " + -10
                        + " l " + -dydx * barHeight + " " + -barHeight
                        }
                        //}
                />
                <path
                    className='fill-southLanPurple'
                    d={"m " + (barLength-13) + " " + 0 +
                        " " + dydx * barHeight + " " + barHeight
                        + " h " + -10
                        + " l " + -dydx * barHeight + " " + -barHeight
                        }
                        //}
                />
                <image className={`transition-opacity ${activeLogo === 'ue' ? '' : 'opacity-0'}`} x={barLength-170} y="5" height={barHeight-10}  xlinkHref={`${ue}`}/>
                <image className={`transition-opacity ${activeLogo === 'monster' ? '' : 'opacity-0'}`} x={barLength-190} y="10" height={barHeight-20}  xlinkHref={`${monster}`}/>
                <image className={`transition-opacity ${activeLogo === 'intel' ? '' : 'opacity-0'}`} x={barLength-180} y="10" height={barHeight-20}  xlinkHref={`${intel}`}/>
                <image className={`transition-opacity ${activeLogo === 'nse' ? '' : 'opacity-0'}`} x={barLength-220} y="15" height={barHeight-30}  xlinkHref={`${nse}`}/>
            </g>
        </svg>
    </div>
}
