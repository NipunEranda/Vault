export const run = async (channel, input) => {
    window.api.send(channel, input);
    return await new Promise((resolve, reject) => {
        window.api.receive(channel, (output) => {
            resolve(output);
        });
    });
}