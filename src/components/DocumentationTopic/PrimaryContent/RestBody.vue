<!--
  This source file is part of the Swift.org open source project

  Copyright (c) 2021 Apple Inc. and the Swift project authors
  Licensed under Apache License v2.0 with Runtime Library Exception

  See https://swift.org/LICENSE.txt for license information
  See https://swift.org/CONTRIBUTORS.txt for Swift project authors
-->

<template>
  <OnThisPageSection :anchor="anchor" :title="title">
    <h2>{{ title }}</h2>
    <ParametersTable :parameters="[bodyParam]" :changes="bodyChanges" keyBy="key">
      <template slot="symbol" slot-scope="{ type, content, changes, name }">
        <PossiblyChangedType
          v-if="!shouldShiftType({ name, content })"
          :type="type"
          :changes="changes.type"
        />
      </template>
      <template slot="description" slot-scope="{ name, content, mimeType, type, changes }">
        <PossiblyChangedType
          v-if="shouldShiftType({ name, content })"
          :type="type"
          :changes="changes.type"
        />
        <ContentNode v-if="content" :content="content" />
        <PossiblyChangedMimetype
          v-if="mimeType"
          :mimetype="mimeType"
          :changes="changes.mimetype"
          :change="changes.change"
        />
      </template>
    </ParametersTable>
    <template v-if="parts.length">
      <h3>Parts</h3>
      <ParametersTable :parameters="parts" class="parts" :changes="partsChanges">
        <template slot="symbol" slot-scope="{ name, type, content, changes }">
          <div class="part-name">
            <WordBreak tag="code">{{ name }}</WordBreak>
          </div>
          <PossiblyChangedType
            v-if="content"
            :type="type"
            :changes="changes.type"
          />
        </template>
        <template
          slot="description"
          slot-scope="{ content, mimeType, required, type, attributes, changes }"
        >
          <div>
            <PossiblyChangedType
              v-if="!content"
              :type="type"
              :changes="changes.type"
            />
            <PossiblyChangedRequiredAttribute
              :required="required"
              :changes="changes.required"
            />
            <ContentNode v-if="content" :content="content" />
            <PossiblyChangedMimetype
              v-if="mimeType"
              :mimetype="mimeType"
              :changes="changes.mimetype"
              :change="changes.change"
            />
            <ParameterAttributes :attributes="attributes" :changes="changes.attributes" />
          </div>
        </template>
      </ParametersTable>
    </template>
  </OnThisPageSection>
</template>

<script>
import { anchorize } from 'docc-render/utils/strings';
import ContentNode from 'docc-render/components/DocumentationTopic/ContentNode.vue';
import OnThisPageSection from 'docc-render/components/DocumentationTopic/OnThisPageSection.vue';

import WordBreak from 'docc-render/components/WordBreak.vue';
import apiChangesProvider from 'docc-render/mixins/apiChangesProvider';
import ParametersTable from './ParametersTable.vue';
import ParameterAttributes from './ParameterAttributes.vue';
import PossiblyChangedType from './PossiblyChangedType.vue';
import PossiblyChangedMimetype from './PossiblyChangedMimetype.vue';
import PossiblyChangedRequiredAttribute from './PossiblyChangedRequiredAttribute.vue';

const ChangesKey = 'restRequestBody';

export default {
  name: 'RestBody',
  mixins: [apiChangesProvider],
  components: {
    PossiblyChangedMimetype,
    PossiblyChangedRequiredAttribute,
    PossiblyChangedType,
    WordBreak,
    ParameterAttributes,
    ContentNode,
    OnThisPageSection,
    ParametersTable,
  },
  constants: { ChangesKey },
  props: {
    bodyContentType: {
      type: Array,
      required: true,
    },
    content: {
      type: Array,
    },
    mimeType: {
      type: String,
      required: true,
    },
    parts: {
      type: Array,
      default: () => ([]),
    },
    title: {
      type: String,
      required: true,
    },
  },
  computed: {
    anchor: ({ title }) => anchorize(title),
    bodyParam: ({
      bodyContentType,
      content,
      mimeType,
    }) => ({
      key: ChangesKey,
      content,
      mimeType,
      type: bodyContentType,
    }),
    bodyChanges: ({ apiChanges }) => (apiChanges || {}),
    partsChanges: ({ bodyChanges }) => (bodyChanges[ChangesKey] || {}).parts,
  },
  methods: {
    // this will return `false` always,
    // because `name` is never provided for this component
    shouldShiftType: ({ content = [], name }) => (!content.length && name),
  },
};
</script>

<style lang="scss" scoped>
@import 'docc-render/styles/_core.scss';

.part-name {
  font-weight: $font-weight-bold;
}
</style>
