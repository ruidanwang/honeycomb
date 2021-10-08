import React from 'react';
import 'antd/dist/antd.css';



class Sheet extends React.Component {
     
    

    componentDidMount() {
        var options = {
            container: 'luckysheet', //luckysheet is the container id
            lang: 'zh',
        }
        window.luckysheet.create(options)
    }

   
    render() {
        const luckyCss = {
            margin: '0px',
            padding: '0px',
            position: 'absolute',
            width: '89%',
            height: '100%',
            left: '10%',
            top: '35px'
        }
        return (
            <div
            id="luckysheet"
            style={luckyCss}
            ></div>
        )
    }
}

export default Sheet