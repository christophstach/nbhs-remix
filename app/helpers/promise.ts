export function delay<T>(promise: Promise<T>, delayTime= 3000): Promise<T> {
    return new Promise(resolve => {
        promise.then(value => {
            setTimeout(() => {
                resolve(value)
            }, delayTime)
        });
    });
}
