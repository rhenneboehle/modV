export default function windowHandler() {
  const windows = {};

  function createHideMouseTimerhandler(canvas) {
    let mouseTimer;

    function hideMouse() {
      canvas.ownerDocument.body.style.cursor = "none";
    }

    return function() {
      if (mouseTimer) {
        clearTimeout(mouseTimer);
      }

      canvas.ownerDocument.body.style.cursor = "default";
      mouseTimer = setTimeout(hideMouse, 200);
    };
  }

  function configureWindow({ win, canvas, title, backgroundColor }) {
    win.document.body.appendChild(canvas);
    win.document.title = title;
    win.document.body.style.backgroundColor = backgroundColor;
  }

  function pollToConfigureWindow(args) {
    let poll;

    function checkIfDone(args) {
      if (args.win.document.readyState === "complete") {
        configureWindow(args);
      } else {
        pollToConfigureWindow(args)();
      }
    }

    return function() {
      if (poll) {
        clearTimeout(poll);
      }

      poll = setTimeout(() => checkIfDone(args), 100);
    };
  }

  this._store.subscribe(async ({ type, payload }) => {
    if (type === "windows/ADD_WINDOW") {
      const { width, height, backgroundColor, title, id } = payload;

      const win = window.open(
        "./output-window.html",
        "modal",
        `width=${width}, height=${height}, location=no, menubar=no, left=0`
      );

      if (win === null || typeof win === "undefined") {
        console.log(
          "Could not create Output Window",
          "modV couldn't open an Output Window. Please check you've allowed pop-ups, then reload"
        );

        return;
      }

      windows[id] = win;

      const canvas = document.createElement("canvas");
      const offscreen = canvas.transferControlToOffscreen();
      const { id: outputId } = await this.store.dispatch(
        "outputs/getAuxillaryOutput",
        {
          canvas: offscreen,
          name: `window-${Object.keys(windows).length}`,
          group: "window"
        },
        [offscreen]
      );

      this.store.commit("windows/UPDATE_WINDOW", {
        id,
        key: "outputId",
        value: outputId
      });

      canvas.style.backgroundColor = "transparent";
      canvas.style.objectFit = "cover";
      canvas.style.width = "100%";

      canvas.addEventListener("dblclick", () => {
        if (!canvas.ownerDocument.webkitFullscreenElement) {
          canvas.webkitRequestFullscreen();
        } else {
          canvas.ownerDocument.webkitExitFullscreen();
        }
      });

      canvas.addEventListener("mousemove", createHideMouseTimerhandler(canvas));

      pollToConfigureWindow({ win, canvas, title, backgroundColor })();

      let timer;

      win.addEventListener("resize", () => {
        if (timer) {
          cancelAnimationFrame(timer);
        }

        // Setup the new requestAnimationFrame()
        timer = requestAnimationFrame(() => {
          const { innerWidth: width, innerHeight: height } = win;

          this.store.dispatch("size/setSize", {
            width,
            height
          });
        });
      });
    }
  });

  window.addEventListener("unload", () => {
    const windowIds = Object.keys(windows);
    for (let i = 0, len = windowIds.length; i < len; i++) {
      windows[windowIds[i]].close();
    }
  });
}
