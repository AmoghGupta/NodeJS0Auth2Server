module.exports = {
    helloWorld: helloWorld,
};

function helloWorld(req, res) {
    if(req["cookies"]["Authorization"]){
      return res.status(200).send({"response":"ok"})
    }
    return res.status(403).send({});
}
