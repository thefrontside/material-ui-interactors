import { test, Page, createInteractor, including } from "bigtest";
import { Button } from "../src/index";
import { IconButton as Component } from "@material-ui/core";
import { PhotoCamera } from '@material-ui/icons';
import { createRenderStep } from "./helpers";

const renderIconButton = createRenderStep(Component, { 'aria-label': "upload picture", children: <PhotoCamera /> });
const button = Button('upload picture');

const SVG = createInteractor<SVGElement>('svg').selector('svg').filters({ className: element => element.classList.toString() });

export default test("IconButton")
  .step(Page.visit("/"))
  .step(renderIconButton())
  .assertion(button.exists())
  .assertion(button.find(SVG()).has({ className: including('MuiSvgIcon-root') }));
