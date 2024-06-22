
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
