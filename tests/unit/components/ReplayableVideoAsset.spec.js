/**
 * This source file is part of the Swift.org open source project
 *
 * Copyright (c) 2021 Apple Inc. and the Swift project authors
 * Licensed under Apache License v2.0 with Runtime Library Exception
 *
 * See https://swift.org/LICENSE.txt for license information
 * See https://swift.org/CONTRIBUTORS.txt for Swift project authors
*/

import { shallowMount } from '@vue/test-utils';
import ReplayableVideoAsset from 'docc-render/components/ReplayableVideoAsset.vue';
import VideoAsset from 'docc-render/components/VideoAsset.vue';
import InlineReplayIcon from 'theme/components/Icons/InlineReplayIcon.vue';

const variants = [{ traits: ['dark', '1x'], url: 'https://www.example.com/myvideo.mp4' }];

const propsData = {
  variants,
};
describe('ReplayableVideoAsset', () => {
  const mountWithProps = props => shallowMount(ReplayableVideoAsset, {
    provide: {
      isTargetIDE: false,
    },
    stubs: { VideoAsset },
    propsData: {
      ...propsData,
      ...props,
    },
  });

  const playMock = jest.fn();

  beforeAll(() => {
    window.matchMedia = () => ({ matches: false });
    window.HTMLMediaElement.prototype.play = playMock;
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('passes the `url` prop to `VideoAsset`', () => {
    const wrapper = mountWithProps();

    const video = wrapper.find(VideoAsset);
    expect(video.props('variants')).toBe(variants);
    expect(video.props('showsControls')).toBe(true);
    expect(video.props('autoplays')).toBe(true);
  });

  it('displays the replay button when the video has ended', () => {
    const wrapper = mountWithProps();

    const replayButton = wrapper.find('.replay-button');

    // Initially, the replay button should not be displayed.
    expect(replayButton.exists()).toBe(true);
    expect(replayButton.classes('visible')).toBe(false);

    expect(replayButton.find('.replay-icon').is(InlineReplayIcon)).toBe(true);
    const video = wrapper.find(VideoAsset);
    video.vm.$emit('ended');

    expect(replayButton.classes('visible')).toBe(true);

    // When the video is playing, the replay button should be hidden.
    replayButton.trigger('click');
    expect(replayButton.classes('visible')).toBe(false);
  });

  it('plays the video if replay button is clicked', () => {
    const wrapper = mountWithProps();

    expect(playMock).toHaveBeenCalledTimes(0);
    wrapper.find('.replay-button').trigger('click');
    expect(playMock).toHaveBeenCalledTimes(1);
  });
});
