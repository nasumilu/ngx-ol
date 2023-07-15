/*
 * Copyright 2023 Michael Lucas <nasumilu.@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import BaseImageLayer from 'ol/layer/BaseImage';
import ImageSource from 'ol/source/Image';
import {Options} from 'ol/layer/BaseImage';
import {AfterContentInit, ContentChild, Directive} from '@angular/core';
import {NgxOlImageSourceProviderDirective} from './image-source-provider.directive';
import {NgxOlLayerProviderDirective} from '../ng-ol-layer/layer-provider.directive';

@Directive({selector: 'ol-base-image-layer'})
export class NgxOlBaseImageLayerProviderDirective<L extends BaseImageLayer<S, any>, S extends ImageSource>
  extends NgxOlLayerProviderDirective<L, Options<S>> implements AfterContentInit {

  @ContentChild(NgxOlImageSourceProviderDirective) sourceProvider?: NgxOlImageSourceProviderDirective<S, never>

  constructor() {
    super();
  }

  override ngAfterContentInit(): void {
    super.ngAfterContentInit();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.layer?.setSource(this.sourceProvider!.source!);
  }

}
