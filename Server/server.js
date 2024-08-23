// import express from 'express';
// import bodyParser from 'body-parser';
// import axios from 'axios';
// import * as dfd from "danfojs-node";
// import * as curlconverter from 'curlconverter';

// const app = express();
// const port = 3000;

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // Utility function to flatten a nested object or array
// const flattenObjectOrArray = (obj, parent = '', res = {}) => {
//     if (Array.isArray(obj)) {
//         // If it's an array, flatten each object in the array and add to the result
//         obj.forEach((item, index) => {
//             const propName = parent ? `${parent}[${index}]` : `${index}`;
//             if (typeof item == 'object' && item !== null) {
//                 flattenObjectOrArray(item, propName, res);
//             } else {
//                 res[propName] = item;
//             }
//         });
//     } else {
//         // If it's an object, flatten it
//         for (let key in obj) {
//             const propName = parent ? parent + '.' + key : key;
//             if (typeof obj[key] == 'object' && obj[key] !== null) {
//                 flattenObjectOrArray(obj[key], propName, res);
//             } else {
//                 res[propName] = obj[key];
//             }
//         }
//     }
//     return res;
// };

// app.post('/curl-to-dataframe', async (req, res) => {
//     const { curlCommand } = req.body;

//     try {
//         const axiosConfig = await curlconverter.toJsonString(curlCommand);
//         const response = await axios(JSON.parse(axiosConfig));
//         console.log(response.data)

//         const flattenedFeatures = response.data.data.map(feature => {
//             let flattenedFeature = {};

//             // Iterate over each key in the feature
//             for (let key in feature) {
//                 if (typeof feature[key] === 'object' && feature[key] !== null) {
//                     // If the key is an object, flatten it
//                     flattenedFeature = {
//                         ...flattenedFeature,
//                         ...flattenObjectOrArray(feature[key], key)
//                     };
//                 } else {
//                     // Otherwise, keep the key as is
//                     flattenedFeature[key] = feature[key];
//                 }
//             }

//             return flattenedFeature;
//         });
//         console.log(flattenedFeatures);

//         const df = new dfd.DataFrame(flattenedFeatures);

//         let df_drop = df.dropNa({ axis: 0 })

//         df_drop?.iloc({ columns: [2, 3, 4] }).print();
//         const jsonResponse = dfd.toJSON(df_drop) // Convert the DataFrame to JSON

//         res.json(jsonResponse);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error processing the cURL command.');
//     }
// });

// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });


// Print columns 4 to 6

// let data = [[1, 2, 3], [1, 5, undefined], [null, 30, 40], [39, NaN, 78]]
// let cols = ["A", "B", "C"]
// let df = new dfd.DataFrame(data, { columns: cols })

// df.print()

// let df_drop = df.dropNa({ axis: 0 })
// df_drop.print()

// res.send("jsonResponse");

import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import * as dfd from "danfojs-node";
import * as curlconverter from 'curlconverter';
import cors from 'cors'; 

const app = express();
const port = 3000;

// app.use(cors());
app.use(cors({
    origin: 'http://localhost:3001'  // Allow only this origin
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Utility function to flatten a nested object or array
const flattenObjectOrArray = (obj, parent = '', res = {}) => {
    if (Array.isArray(obj)) {
        // If it's an array, flatten each object in the array and add to the result
        obj.forEach((item, index) => {
            const propName = parent ? `${parent}[${index}]` : `${index}`;
            if (typeof item == 'object' && item !== null) {
                flattenObjectOrArray(item, propName, res);
            } else {
                res[propName] = item;
            }
        });
    } else {
        // If it's an object, flatten it
        for (let key in obj) {
            const propName = parent ? parent + '.' + key : key;
            if (typeof obj[key] == 'object' && obj[key] !== null) {
                flattenObjectOrArray(obj[key], propName, res);
            } else {
                res[propName] = obj[key];
            }
        }
    }
    return res;
};

// API 1: Convert cURL command to fetch call and return the response data
app.post('/curl-to-response', async (req, res) => {
    const { curlCommand } = req.body;

    try {
        console.log(curlCommand)
        const axiosConfig =curlconverter.toJsonString(curlCommand);
        console.log("axiosConfig",axiosConfig)
        const response = await axios(JSON.parse(axiosConfig));
        console.log("response",response)
        res.json(response.data); // Send the response data directly
    } catch (error) {
        // console.log(error.response);
        res.status(500).send("Error");
    }
});

// API 2: Flatten the response data
app.post('/curl-to-flattened-response', async (req, res) => {
    const { curlCommand, responseVariable } = req.body;

    try {
        const axiosConfig = await curlconverter.toJsonString(curlCommand);
        const response = await axios(JSON.parse(axiosConfig));

        const dataToFlatten = response.data[responseVariable];
        const flattenedData = dataToFlatten.map(feature => flattenObjectOrArray(feature));

        res.json(flattenedData); // Send the flattened data
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing the cURL command.');
    }
});

// API 3: Flatten and normalize (remove null, undefined, NaN) the response data
app.post('/curl-to-normalized-response', async (req, res) => {
    const { curlCommand, responseVariable } = req.body;

    try {
        const axiosConfig = await curlconverter.toJsonString(curlCommand);
        const response = await axios(JSON.parse(axiosConfig));

        const dataToFlatten = response.data[responseVariable];
        const flattenedData = dataToFlatten.map(feature => flattenObjectOrArray(feature));

        const df = new dfd.DataFrame(flattenedData);
        const normalizedDF = df.dropNa({ axis: 1 }); // Drop columns with NaN, null, undefined values
        const normalizedData = dfd.toJSON(normalizedDF); // Convert the DataFrame to JSON

        res.json(normalizedData); // Send the normalized data
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing the cURL command.');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

