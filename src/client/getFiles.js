import React , {useState, useEffect } from 'react'
const AWS = require('aws-sdk')

const getImage = async (key) => {
    try {
        AWS.config.setPromisesDependency()
        AWS.config.update({
            region: 'us-east-2'
        })
        const S3 = new AWS.S3()
        const response = await S3.getObject({
            Bucket: 'fluencydaily',
            Key: key
        }).promise()

       return response

    }
    catch(error) {
        console.log(error)
    }
}

const encode = (data) => {
    const buf = Buffer.from(data)
    const base64 = buf.toString('base64')
    return base64
}


const Image = () => {

    const [image,setImage] = useState(false)

    useEffect(() => {
        getImage('FluencyDaily.png')
        .then(img => {
            setImage(<img alt='logo' src={`data:image/png;base64, ${encode(img.Body)}`}/>)
        })
    }, [])

    

    return (
    image ? image : null
    )
}



export default Image