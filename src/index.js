import React from 'react';
import ReactDOM from 'react-dom';

import 'antd/dist/antd.css'
import App from './App';

//读取local中存在的user 保存到内存中
import storageUtils from './utils/storageUtils'
import memoryUtils from './utils/memoryUtils'

const user = storageUtils.getUser()
memoryUtils.user = user

ReactDOM.render(

    <
    App / > ,

    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA