const { io } = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();

bands.addBand(new Band("Queen"));
bands.addBand(new Band("Frank Sinatra"));
bands.addBand(new Band("Aurora"));
bands.addBand(new Band("Dean Martin"));

// Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado');

    client.emit("active-bands", bands.getBands());

    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    client.on("vote-band", (payload) => {

        // console.log(payload);
        bands.voteBand(payload.id);
        // Se manda de nuevo la informacion actualizada, A TODOS
        io.emit("active-bands", bands.getBands());
    });

    client.on("add-band", (payload) => {

        const newBand = new Band(payload.name)
        bands.addBand(newBand);
        io.emit("active-bands", bands.getBands());
    });

    client.on("delete-band", (payload) => {

        bands.deleteBand(payload.id);
        io.emit("active-bands", bands.getBands());
    });




    // client.on("emitir-mensaje", (payload) => {
    //     // io.emit("nuevo-mensaje", payload); // Emite a todos
    //     client.broadcast.emit("nuevo-mensaje", payload); // Emite a todos menos al cliente que emite el mensaje
    // });

    // client.on('mensaje', ( payload ) => {
    //     console.log('Mensaje', payload);

    //     io.emit( 'mensaje', { admin: 'Nuevo mensaje' } );

    // });


});