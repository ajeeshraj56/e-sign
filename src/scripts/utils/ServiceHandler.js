import axios from 'axios';
import config from './config';

let instance = axios.create({
    baseURL: config.baseUrl + config.version + '/',
    headers: { 'Content-Type': 'application/json' },
    crossDomain: true
});
instance.all = axios.all;

let postMultiple = function (params) {
    var postAll = params.configs.map(param => {
        return instance.post(param.url, param.data);
    })

    instance.all(postAll).then(results => {
        results.map((result, i) => {
            if (params.ok) {
                params.ok(result.data);
            }
        })
    })

}

let getMultiple = function (options, onOk, onKo) {
    var getAll = options.map(option => {
        return instance.get(option.url)
    })

    instance.all(getAll).then(res => {
      if(res && res.length > 0) {
          let error = res.filter(item => {
            return item.data.status !== 'OK';
          });
          if(error && error.length > 0 && onKo) {
            handleKo(onKo);
          } else if(onOk) {
            onOk(res);
          }
      } else {
        handleKo(onKo);
      }
    }, err => {
        handleKo(onKo);
    })

}
var post = function (options, onOk, onKo) {
    instance({
        method: 'post',
        url: options.url,
        data: options.data,
    }).then(res => {
        if (onOk && res.status == 'OK' || res.status == 200)  {
            onOk(res);
        } else if (onKo) {
            onKo(res);
        }
    }, err => {
        handleKo(onKo);
    })
}

let put = function (options, onOk, onKo) {
    instance.put(options.url, options.data).then(res => {
        if ((onOk && onOk(res)) || !onOk) {
            var successMsg = options.successMessage || 'The file has been updated';
        }
    }, err => {
        handleKo(onKo);
    })
}


let deleteQuery = function (options, onOk, onKo) {

    instance.delete(options.url).then(res => {
        if ((onOk && onOk(res)) || !onOk) {
            var successMsg = options.successMessage || 'The file has been deleted';
        }
    }, err => {
        if ((onKo && onKo(err)) || !onKo) {
            var errorMsg = options.errorMessage || 'Something went wrong!';
        }
    })
}


let  get = function (options, onOk, onKo) {

    instance.get(options.url, options.data).then(res => {
        if (onOk && res.data.status == 'OK') {
            onOk(res);
        } else if (onKo) {
            onKo(res);
        }
    }, err => {
        handleKo(onKo);
    })
}

let handleKo = function(onKo) {
    if (onKo) {
        let data = {
            status: 'EXCEPTION',
            message: 'Internal server error - 500!'
        }
        onKo(data)
    }
}

export default {
    post: post,
    getMultiple: getMultiple,
    put: put,
    get: get,
    delete: deleteQuery
};
