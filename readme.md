# MCCREE

A front end solution for mutlimedia loading, mux, demux, stream and play.

- [About](#about)
- [Structure](#structure)
- [Getting Started](#getting-started)
- [Modules and Status](#modules-and-status)
- [Contributors](#license)
- [License](#license)

## About

Mccree is a front end multimedia framework, which is able to loading, mux, demux and play. It is written in ECMAScript 6, use Lerna for package management. The ability of mccree is highly depends on its packages. Currently, it support the following features:
- Load source through the web fetch API.
- Load source through the Mozilla XMLHttpRequest API.
- Load source through the Tencent p2p SDK.
- Demux Flv format video.
- Remux H264 and AAC to Mp4 format.
- Playback through the web MediaSource Extension.
  
The following features will be supported soon:

- Load hls source through the web XMLHttpRequest API.
- Load source from local flv file.
- Demux m3u8 and ts file (hls).
- Audio Context (Gain) feature.


## Structure

<img alt="Mccree" src="https://www.processon.com/chart_image/59817f6fe4b06886663b776b.png" width="1000">


## Getting Started
TBA (After panda-mccree-live module released)

## Modules and Status
|name|dev|test|doc|comments|developer|org|status|
|---|---|---|---|---|---|---|---|
|mccree-core|100%||||Yuqing Jiang|PandaTv|TBA(before 2017-08-15)|
|mccree-core-track|100%|100%|√|√|Yuqing Jiang|PandaTv|realesed|
|mccree-core-loaderbuffer|100%||||Yuqing Jiang|PandaTv|TBA(before 2017-08-15)|
|mccree-helper-utils|100%|100%|√|√|Yuqing Jiang|PandaTv|realesed|
|mccree-helper-logger|100%|100%|√|√|Yuqing Jiang|PandaTv|realesed|
|mccree-helper-browser|100%||||Yuqing Jiang|PandaTv|---|
|mccree-controller-loader|100%||||Yuqing Jiang|PandaTv|TBA(before 2017-08-15)|
|mccree-loader-fetch|100%||||Yuqing Jiang|PandaTv|---|
|mccree-loader-moz-xhr|100%||||Yuqing Jiang|PandaTv|---|
|mccree-loader-tencentp2p|100%||||Tencent Team|Tencent|---|
|mccree-loader-hls|70%||||Jiaqi Li|PandaTv|---|
|mccree-demuxer-flv|100%||||Yuqing Jiang|PandaTv|---|
|mccree-demuxer-ts|30%||||Jiaqi Li|PandaTv|---|
|mccree-remuxer-mp4live|100%||||Yuqing Jiang|PandaTv|---|
|panda-mccree-live|100%||||Yuqing Jiang|PandaTv|---|


## Contributors

#### core team
- PandaTv team

|name|github|email|blog|
|---|---|---|---|
|Yuqing Jiang|[yqjiang](https://github.com/yqjiang)|jiangyuqing@panda.tv||
|Jiaqi Li|[lee920217](https://github.com/lee920217)|lijiaqi@panda.tv||

#### Other contributors
TBA 

## Join us
Read ./docs/en/developer.md

## License
TBA
