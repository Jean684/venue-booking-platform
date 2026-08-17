// no window.localStorage because Next initially load the HTML
// if put in window objects --> not matching and crash 

export function setItem(key: string, value: unknown) {
    try { 
        localStorage.setItem(key, JSON.stringify(value))
    } catch(error) { 
        console.log(error) 
    }
}

export function getItem(key: string) { 
    try { 
        const item = localStorage.getItem(key)
        return item ? JSON.parse(item) : undefined
    } catch(error) {
        console.log(error)
    }
}
