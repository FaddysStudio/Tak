# Faddy's Tak/Snare Synthesizer

?# if [ ! -d node_modules/@faddys/scenarist ]; then npm i @faddys/scenarist ; fi

?# cat - > index.orc

+==

sr = 48000
ksmps = 32
nchnls = 2
0dbfs = 1

giStrikeFT ftgen 0, 0, 256, 1, "marmstk1.wav", 0, 0, 0
giVibratoFT ftgen 0, 0, 128, 10, 1

instr 13, tak

aNote = 0

iPitch init frac ( p1 )

iAttack init 1/128
iDecay init 1/64 
iRelease init 1/64

aMainSubAmplitude linseg 0, iAttack, 1, iDecay, .25, iRelease, 0
aMainSubFrequency linseg cpsoct ( 10 + iPitch ), iAttack, cpsoct ( 7 + iPitch )

aMainSub poscil aMainSubAmplitude, aMainSubFrequency

aNote += aMainSub

aHighSubAmplitude linseg 0, iAttack/8, 1, iDecay/8, .25, iRelease/8, 0
aHighSubFrequency linseg cpsoct ( 12 + iPitch ), iAttack/2, cpsoct ( 9 + iPitch )

aHighSub poscil aHighSubAmplitude, aHighSubFrequency

aNote += aHighSub

kGogobellAmplitude linseg 1, iAttack + iDecay, 0

aGogobell gogobel 1, cpsoct ( 6 + iPitch ), .75, .75, giStrikeFT, 6.0, 0.3, giVibratoFT

aNote += aGogobell/4

aSnatchAmplitude linseg 0, iAttack/8, 1, iDecay/8, 0
aSnatchFrequency linseg cpsoct ( 13 + iPitch ), iAttack/2, cpsoct ( 11 + iPitch )

aSnatch noise aSnatchAmplitude, 0
aSnatch butterlp aSnatch, aSnatchFrequency

aNote += aSnatch

aNote clip aNote, 1, 1

outs aNote, aNote

endin

-==

?# cat - > index.mjs

+==

import Scenarist from '@faddys/scenarist';

await Scenarist ( new class {

$_producer ( $ ) {

const tak = this;

tak .degrees = parseInt ( process .argv .slice ( 2 ) .pop () ) || 24;

tak .prepare ();

}

prepare () {

const tak = this;

for ( let step = 0; step < tak .degrees; step++ ) {

let index = ( step / 100 ) .toString () .slice ( 2 );

index += '0' .repeat ( 2 - index .length );

let score = `sco/${ index }.sco`;
let audio = `audio/${ index }.wav`;

console .log ( [

`echo "i [ 13 + ${ step / tak .degrees } ] 0 1" > ${ score }`,
`echo "i [ 13 + ${ ( step + 1 ) % tak .degrees / tak .degrees } ] ${ 1/512 } 1" >> ${ score }`,
`echo "i [ 13 + ${ ( step + 2 ) % tak .degrees / tak .degrees } ] ${ 2/512 } 1" >> ${ score }`,
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
