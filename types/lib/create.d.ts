export namespace create {
    function doCreate(): Promise<void>;
    function doDelete(): Promise<void>;
    function doPrepare(): Promise<void>;
    function doRun(): Promise<void>;
    function doInstall(): Promise<void>;
    function doCustomise(): Promise<void>;
}
