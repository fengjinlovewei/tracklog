
export default class TrackLog {
  click: OptionType["click"];
  show: OptionType["show"];
  obServerList: HTMLElement[];

  constructor(option: OptionType) {
    const { click = () => {}, show = () => {} } = option;
    this.click = click;
    this.show = show;
    this.obServerList = [];
    this.init();
  }
  init() {
    window.addEventListener("click", this.getClickTrack.bind(this), true);
    // Firefox和Chrome早期版本中带有前缀
    // @ts-ignore
    const MutationObserver =
      window.MutationObserver ||
      // @ts-ignore
      window.WebKitMutationObserver ||
      // @ts-ignore
      window.MozMutationObserver;

    if (!MutationObserver) {
      console.error("TrackLog 依赖的MutationObserver缺失！");
      return;
    }
    // 创建观察者对象
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        for (let currentNode of mutation.addedNodes) {
          // 获取添加的节点
          if (currentNode.nodeType === 1) {
            //查看节点自身是否有曝光埋点，然后添加曝光监听
            this.bindShow(currentNode as HTMLElement);
            //获取当前节点的后代曝光节点
            const childrenShowList: HTMLElement[] = Array.from(
              (currentNode as HTMLElement).querySelectorAll("[data-trackshow]")
            );
            //后代添加曝光监听
            childrenShowList.forEach((item) => {
              this.bindShow(item);
            });
          }
        }
      });
    });
    // 传入目标节点和观察选项
    observer.observe(document.getElementsByTagName("body")[0], {
      childList: true,
      subtree: true,
    });
  }

  bindShow(ele: HTMLElement) {
    const track = (ele.dataset || {})["trackshow"];

    if (track) {
      return this.obServerView(ele);
    }
  }
  getClickTrack(e: Event) {
    let target = e.target as HTMLElement;

    while (target) {
      // debugger
      const tagName = target?.tagName || "";
      if (tagName.toLowerCase() === "html") break;

      const trackData = (target.dataset || {})["trackclick"];

      if (trackData && trackData !== "false") {
        this.click?.(trackData);
      }
      target = target.parentNode as HTMLElement;
    }
  }
  getShowTrack(ele: HTMLElement) {
    const trackData = (ele.dataset || {})["trackshow"];

    if (trackData && trackData !== "false") {
      this.show?.(trackData);
    }
  }
  obServerView(ele: HTMLElement) {
    if (!ele) return;
    // 阻止重复注册ref，导致多次观测
    if (this.obServerList.indexOf(ele) > -1) return;

    this.obServerList.push(ele);
    const io = new IntersectionObserver(
      (entries) => {
        // 有些移动端机型，尤其android机型， 会达不到1的阈值，所以这里设置成了0.8。
        // threshold: 0.8 设置成0.8
        if (entries[0].intersectionRatio >= 0.8) {
          this.getShowTrack(ele);
          this.obServerList.filter((item) => item !== ele);
          io.unobserve(ele);
        }
      },
      {
        threshold: 0.8,
      }
    );
    io.observe(ele);
  }
}
