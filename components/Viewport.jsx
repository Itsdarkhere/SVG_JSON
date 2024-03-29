'use client'
import React from "react";
// import * as PIXI from "pixi.js";
import { PixiComponent, useApp } from "@pixi/react";
import { EventSystem } from "@pixi/events";
import { Viewport as PixiViewport } from "pixi-viewport";

const Viewport = (props) => {
  const app = useApp();
  return <PixiComponentViewport app={app} {...props} />;
};

const PixiComponentViewport = PixiComponent("Viewport", {
  create: (props) => {
    // if (!("events" in props.app.renderer))
    //   props.app.renderer.addSystem(EventSystem, "events");

    const { width, height } = props;
    const events = new EventSystem(props.app.renderer);
		events.domElement = props.app.renderer.view;
  
    const viewport = new PixiViewport({
      screenWidth: width,
      screenHeight: height,
      worldWidth: width,
      worldHeight: height,
      ticker: props.app.ticker,
      events: events,
    });

    viewport
      .drag().pinch().wheel()
      .clampZoom({minWidth: 100, maxWidth: width})
      .decelerate();

    return viewport;
  }
});

export default Viewport;
