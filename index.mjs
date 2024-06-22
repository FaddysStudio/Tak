
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
