"use strict";
const testString = `
<template>
    <div>
    </div>
</template>

<script>
export default {

    methods: {},
    components: {}

}
</script>

<style type= "css">

div{
    background-color: red;
}
</style>
`;
/**
 * . any character except newline
 * * zero or more times
 * + one or more times
 * ? zero or one time
 */
let testing = "891282385";
let regex = /[8][\d]{7}[4|5]/;
let regex2 = /(<template(\s|\S)*<\/template>)/gm;
testString.match(regex2)[0];
//# sourceMappingURL=regex.js.map