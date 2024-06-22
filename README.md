# Faddy's Dom/Kick Synthesizer

?# if [ ! -d node_modules/@faddys/scenarist ]; then npm i @faddys/scenarist ; fi

?# cat - > index.orc

+==

sr = 48000
ksmps = 32
nchnls = 2
0dbfs = 1

giStrikeFT ftgen 0, 0, 256, 1, "marmstk1.wav", 0, 0, 0
giVibratoFT ftgen 0, 0, 128, 10, 1

instr 13, dom

aNote = 0

iPitch init frac ( p1 )

iAttack init 1/32
iDecay init 1/8 
iRelease init 1/2

aMainSubAmplitude linseg 0, iAttack, 1, iDecay, .25, iRelease, 0
aMainSubFrequency linseg cpsoct ( 8 + iPitch ), iAttack, cpsoct ( 5 + iPitch )

aMainSub poscil aMainSubAmplitude, aMainSubFrequency

aNote += aMainSub

aHighSubAmplitude linseg 0, iAttack/8, 1, iDecay/8, .25, iRelease/8, 0
aHighSubFrequency linseg cpsoct ( 10 + iPitch ), iAttack/2, cpsoct ( 7 + iPitch )

aHighSub poscil aHighSubAmplitude, aHighSubFrequency

aNote += aHighSub / 8

aGogobell gogobel 1, cpsoct ( 5 + iPitch ), .5, .5, giStrikeFT, 6.0, 0.3, giVibratoFT

aNote += aGogobell / 4

aSnatchAmplitude linseg 0, iAttack/8, 1, iDecay/8, 0
aSnatchFrequency linseg cpsoct ( 10 + iPitch ), iAttack/2, cpsoct ( 9 + iPitch )

aSnatch noise aSnatchAmplitude, 0
aSnatch butterlp aSnatch, aSnatchFrequency

aNote += aSnatch*4

aNote clip aNote, 1, 1

outs aNote, aNote

endin

-==

?# cat - > index.mjs

+==

import Scenarist from '@faddys/scenarist';

await Scenarist ( new class {

$_producer ( $ ) {

const dom = this;

dom .degrees = parseInt ( process .argv .slice ( 2 ) .pop () ) || 24;

dom .prepare ();

}

prepare () {

const dom = this;

for ( let step = 0; step < dom .degrees; step++ ) {

let index = ( step / 100 ) .toString () .slice ( 2 );

index += '0' .repeat ( 2 - index .length );

let score = `sco/${ index }.sco`;
let audio = `audio/${ index }.wav`;

console .log ( [

`echo "i [ 13 + ${ step / dom .degrees } ] 0 1" > ${ score }`,
`csound -o ${ audio } index.orc ${ score }`,
`aplay ${ audio }`

] .join ( ' ; ' ) );

}

}

} );

-==

?# rm -fr index.sh sco audio ; mkdir sco audio
?# node ./index.mjs >> index.sh

?# bash index.sh
