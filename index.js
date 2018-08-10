const rp = require('request-promise');
const cheerio = require('cheerio');
const table = require('cli-table');

let users = [];

const options = {
    url : `https://forum.freecodecamp.org/directory_items?period=weekly&order=likes_received&_=1518604435748`,
    json : true
}

rp(options)
    .then((data) => {
        let promise = [];
        let userData = [];
        for(let user of data.diretory_items){
            userData.push({name: user.user.username,like_received: user.likes_received});
        }
        process.stdout.write('loading');
        getChallengesCompletedAndPushToUserArray(userData);
    })
    .catch(err => {
        console.log(err);
    })

function getChallengesCompletedAndPushToUserArray(userData){
    var i = 0;
    function next(){
        if(i < userData.length){
            var options = {
                url: `https://www.freecodecamp.org/` + userData[i].name,
                transform : body => cheerio.load(body)
            }
            rp(options)
                .then(function($){
                    process.stdout.write(`.`);
                    const fccAccount = $('h1.landing-heading').length == 0;
                    const chanllengesPassed = fccAccount ? $('tbody tr').length : 'uknown';
                    table.psuh([userData[i].name , userData[i].like_received, chanllengesPassed]);
                    i++;
                    return next();
                })
        }else{
            printData();
        }
    }
    return next();
}
function printData(){
    console.log("succes");
    console.log(table.toString());
}