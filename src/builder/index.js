const util = require('util');
const fs = require('fs');
let exp = {};


function ClassBuilder(c) {
	if (c == undefined) c = class {};
	
	let class_dir = require('../classes/funky_dir');
	let func_dir = require('../functions/funky_dir');
	
    let classes = fs.readdirSync(class_dir).filter( file => ((file.endsWith('.js') || file.endsWith('.ts')) ));
	let functions = fs.readdirSync(func_dir).filter( file => ((file.endsWith('.js') || file.endsWith('.ts')) ));

	
	
	// adds classes
    classes.forEach( (file) => {
        let { refs, data } = require(`../classes/${file}`)(c);

        refs.forEach( (ref) => {
            Object.defineProperty(c, ref, { value: data });
			Object.defineProperty(c.prototype, ref, { value: data });
        });
    });


	
	// adds functions
	functions.forEach( (file) => {
        let { refs, data } = require(`../functions/${file}`)(c);

        refs.forEach( (ref) => {
            Object.defineProperty(c, ref, { value: data });
			Object.defineProperty(c.prototype, ref, { value: data });
        });
    });



	// adds inspect
	function insp() {
		return util.inspect(this, { colors: true });
	}
	
    Object.defineProperty(c, "__inspect", { get: insp });
	Object.defineProperty(c.prototype, "__inspect", { get: insp });

	
	
	return c;
}


exp.builder = ClassBuilder;
module.exports = exp;
