'use client'
import React from "react";
import * as PIXI from "pixi.js";
import { PixiComponent, useApp } from "@pixi/react";
import { Viewport as PixiViewport } from "pixi-viewport";

const Viewport = (props) => {
  const app = useApp();
  return <PixiComponentViewport app={app} {...props} />;
};

const PixiComponentViewport = PixiComponent("Viewport", {
  create: (props) => {
    if (!("events" in props.app.renderer))
      props.app.renderer.addSystem(PIXI.EventSystem, "events");

    const { width, height } = props;
    const { ticker } = props.app;
    const events = new PIXI.EventSystem(props.app.renderer);
		events.domElement = props.app.renderer.view;
  
    const viewport = new PixiViewport({
      screenWidth: width,
      screenHeight: height,
      worldWidth: width,
      worldHeight: height,
      ticker: props.app.ticker,
      events: events,
    });

    // Add stuff we need to the viewport
    viewport
      .wheel()
      .drag()
      .pinch()
      .decelerate();
    return viewport;
  },
});

export default Viewport;
