        let random = Math.floor(Math.random() * 101010101);
        let account = await fds.CreateAccount(`${random}-swarmhole-throwaway`,'');
        await account.send('swarmsummit3333', file);