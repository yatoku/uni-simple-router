import {Router, proxyHookName, totalNextRoute, navtoRule} from '../options/base';

export class MyArray extends Array {
    constructor(private router:Router, private vueEachArray:Array<Function>, private myEachHook:Function) {
        super();
        Object.setPrototypeOf(this, MyArray.prototype)
    }
    push(v:any):any {
        this.vueEachArray.splice(0, 1, v);
        this[this.length] = (to: totalNextRoute, from: totalNextRoute, next:(rule: navtoRule)=>void) => {
            this.myEachHook(to, from, next, this.router);
        };
    }
}

export function proxyEachHook(router:Router, vueRouter:any):void {
    const hookList:Array<string> = ['beforeHooks', 'afterHooks'];
    for (let i = 0; i < hookList.length; i++) {
        const hookName = hookList[i];
        const myEachHook = router.lifeCycle[(hookName as proxyHookName)][0];
        if (myEachHook) {
            const vueEachArray:Array<Function> = vueRouter[hookName];
            vueRouter[hookName] = new MyArray(router, vueEachArray, myEachHook);
        }
    }
}