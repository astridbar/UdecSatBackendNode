const { pool } = require('../conexiones/configDB')
const pusher = require('../conexiones/configPusher')

let pgClient;

pool.connect((err, client) => {
    if (err) {
        console.log(err);
    }

    console.log("conexion ala base datos");
    pgClient = client;
    client.on('notification', function (msg) {
        pusher.trigger('watch_dato_sensor', 'new_record', JSON.parse(msg.payload));
    });
    const query = client.query('LISTEN watch_dato_sensor');
});

exports.datosfk = async (req, res) => {
    let data = `SELECT * From public.dato_sensor where "fk_sensor"='${req.params.fk_sensor}'`;

    const query = await pgClient.query(data, function select(error, result, fields) {

        if (error) {
            console.log(error);

            return query;
        }

        res.send(result.rows)

    });
    console.log("fin.");
};


exports.datosfks = async (req, res) => {
    let data = `SELECT * From public.dato_sensor where "fk_sensor"
='${req.params.fk_sensor}'`;

    const query = await pgClient.query(data, function select(error, result, fields) {

        if (error) {
            console.log(error);

            return query;
        }

        res.send(result.rows)

    });
    console.log("fin.");
};

exports.datos = async (req, res) => {
    let data = `SELECT*From public.dato_sensor`;
    const query = await pgClient.query(data, function select(error, result, fields) {
        if (error) {
            console.log(error);

            return query;
        }

        res.send(result.rows)

    });
    console.log("fin.");
};
//ultimos 5 datos 

exports.Ultimos = async (req, res) => {
    let data = `SELECT *
	FROM public.promedio_nivelactual t 	where t.id= ${req.params.id}`;

    const query = await pgClient.query(data, function select(error, result, fields) {

        if (error) {
            console.log(error);

            return query;
        }

        res.send(result.rows)

    });
    console.log("fin.");
};

exports.datosPersonalzados = async (req, res) => {
    let data = `SELECT "idSensor","valor", "fecha", "hora","nombreSensor", "nombreEstacion","maxSensor", "minSensor"
        From public.dato_sensor  INNER JOIN public.sensor ON dato_sensor.fk_sensor = "idSensor"
        INNER JOIN public.estacion ON sensor.fk_estacion = "idEstacion"
        INNER JOIN public.tiposensores ON sensor.fk_sensores = "id_tipoSensor" WHERE estacion.id_ciudad =${req.params.id_ciudad}`;

    const query = await pgClient.query(data, function select(error, result, fields) {

        if (error) {
            console.log(error);

            return query;
        }

        res.send(result.rows)

    });
    console.log("fin.");
};


exports.datosFecha = async (req, res) => {
    let data = `SELECT "idSensor","valor", "fecha", "hora","nombreSensor", "nombreEstacion","maxSensor", "minSensor"
            From public.dato_sensor  INNER JOIN public.sensor ON dato_sensor.fk_sensor = "idSensor"
            INNER JOIN public.estacion ON sensor.fk_estacion = "idEstacion"
            INNER JOIN public.tiposensores ON sensor.fk_sensores = "id_tipoSensor" WHERE "fecha"='${req.params.fecha}'`;

    const query = await pgClient.query(data, function select(error, result, fields) {

        if (error) {
            console.log(error);

            return query;
        }

        res.send(result.rows)

    });
    console.log("fin.");
};

exports.datosHora = async (req, res) => {
    let data = `SELECT "idSensor","valor", "fecha", "hora","nombreSensor", "nombreEstacion","maxSensor", "minSensor"
                From public.dato_sensor  INNER JOIN public.sensor ON dato_sensor.fk_sensor = "idSensor"
                INNER JOIN public.estacion ON sensor.fk_estacion = "idEstacion"
                INNER JOIN public.tiposensores ON sensor.fk_sensores = "id_tipoSensor" WHERE "hora"='${req.params.hora}'`;

    const query = await pgClient.query(data, function select(error, result, fields) {

        if (error) {
            console.log(error);

            return query;
        }

        res.send(result.rows)

    });
    console.log("fin.");
};

exports.datosFechaHora = async (req, res) => {
    let data = `SELECT "idSensor","valor", "fecha", "hora","nombreSensor", "nombreEstacion","maxSensor", "minSensor"
                    From public.dato_sensor  INNER JOIN public.sensor ON dato_sensor.fk_sensor = "idSensor"
                    INNER JOIN public.estacion ON sensor.fk_estacion = "idEstacion"
                    INNER JOIN public.tiposensores ON sensor.fk_sensores = "id_tipoSensor" WHERE "hora"='${req.params.hora}' AND "fecha"='${req.params.fecha}'`;

    const query = await pgClient.query(data, function select(error, result, fields) {

        if (error) {
            console.log(error);

            return query;
        }

        res.send(result.rows)

    });
    console.log("fin.");
};
exports.maximo = async (req, res) => {
    let data = `SELECT count(*) as alerta,ubicacion FROM public.max_min where "valor">="maxSensor" 
    GROUP BY ubicacion`;
    const query = await pgClient.query(data, function select(error, result, fields) {

        if (error) {
            console.log(error);

            return query;
        }

        res.send(result.rows)

    });
    console.log("fin.");
};
exports.minimo = async (req, res) => {

    let datas = `SELECT * FROM public.max_min where "valor"<="minSensor" `;

    const querys = pgClient.query(datas, function select(error, results, fields) {

        if (error) {
            console.log(error);

            return querys;
        }

        res.send(results.rows)
        console.log(results.rows)
    });
    console.log("fin.");
};
exports.datosultimo = async (req, res) => {
    let data = `SELECT DISTINCT *,"identificador",ubicacion From public.dato_sensor
    INNER JOIN public.sensor ON dato_sensor.fk_sensor ="idSensor" 
    INNER JOIN public.estacion ON sensor.fk_estacion="idEstacion"
    INNER JOIN public.ciudades ON estacion.id_ciudad="id"
    where "fk_sensor"= ${req.params.fk_idSensor} 
    ORDER BY "fecha" desc, "hora" desc limit 5`;
    const query = await pgClient.query(data, function select(error, result, fields) {
        if (error) {
            console.log(error);
            return query;
        }
        res.send(result.rows)

    });
    console.log("fin.");
};

exports.promedio = async (req, res) => {
    let data = `SELECT * FROM public.promediofinal_total where id= ${req.params.id} `;
    const query = await pgClient.query(data, function select(error, result, fields) {
        if (error) {
            console.log(error);
            return query;
        }
        res.send(result.rows)

    });
    console.log("fin.");
};
exports.maximo1 = async (req, res) => {
    let data = `SELECT valor,"maxSensor", "minSensor","fk_sensor",ubicacion From public.dato_sensor
                        INNER JOIN public.sensor ON dato_sensor.fk_sensor ="idSensor"
                        INNER JOIN public.estacion ON sensor.fk_estacion="idEstacion"
                        INNER JOIN public.ciudades ON estacion.id_ciudad="id"
                                where "fk_sensor"= ${req.params.fk_idSensor}
                                and "valor">="maxSensor"
                                ORDER BY "fecha" desc, "hora" desc limit 1 `;

    const query = await pgClient.query(data, function select(error, result, fields) {

        if (error) {
            console.log(error);

            return query;
        }

        res.send(result.rows)

    });
    console.log("fin.");
};
exports.minimo1 = async (req, res) => {

    let datas = `SELECT valor,"maxSensor", "minSensor","fk_sensor",ubicacion From public.dato_sensor
                                    INNER JOIN public.sensor ON dato_sensor.fk_sensor ="idSensor"
                                    INNER JOIN public.estacion ON sensor.fk_estacion="idEstacion"
                                    INNER JOIN public.ciudades ON estacion.id_ciudad="id"
                                            where "fk_sensor"= ${req.params.fk_idSensor}
                                            and "valor"<="minSensor"
                                            ORDER BY "fecha" desc, "hora" desc limit 1 `;

    const querys = pgClient.query(datas, function select(error, results, fields) {

        if (error) {
            console.log(error);

            return querys;
        }

        res.send(results.rows)
        console.log(results.rows)
    });
    console.log("fin.");
};