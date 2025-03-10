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
    <ParametersTable :parameters="parameters" :changes="parameterChanges">
      <template slot="symbol" slot-scope="{ name, type, content, changes, deprecated }">
        <div class="param-name" :class="{ deprecated: deprecated }">
          <WordBreak tag="code">{{ name }}</WordBreak>
        </div>
        <PossiblyChangedType
          v-if="!shouldShiftType({content, name})"
          :type="type"
          :changes="changes.type"
        />
      </template>
      <template
        slot="description"
        slot-scope="{ name, type, content, required, attributes, changes, deprecated }"
      >
        <div>
          <PossiblyChangedType
            v-if="shouldShiftType({content, name})"
            :type="type"
            :changes="changes.type"
          />
          <template v-if="deprecated">
            <Badge variant="deprecated" class="param-deprecated" />&nbsp;
          </template>
          <PossiblyChangedRequiredAttribute
            :required="required"
            :changes="changes.required"
          />
          <ContentNode v-if="content" :content="content" />
          <ParameterAttributes :attributes="attributes" :changes="changes" />
        </div>
      </template>
    </ParametersTable>
  </OnThisPageSection>
</template>

<script>
import { anchorize } from 'docc-render/utils/strings';
import ContentNode from 'docc-render/components/DocumentationTopic/ContentNode.vue';
import OnThisPageSection from 'docc-render/components/DocumentationTopic/OnThisPageSection.vue';

import WordBreak from 'docc-render/components/WordBreak.vue';
import apiChangesProvider from 'docc-render/mixins/apiChangesProvider';
import Badge from 'docc-render/components/Badge.vue';
import ParametersTable from './ParametersTable.vue';
import ParameterAttributes from './ParameterAttributes.vue';
import PossiblyChangedRequiredAttribute from './PossiblyChangedRequiredAttribute.vue';
import PossiblyChangedType from './PossiblyChangedType.vue';

export default {
  name: 'RestParameters',
  mixins: [apiChangesProvider],
  components: {
    Badge,
    PossiblyChangedType,
    PossiblyChangedRequiredAttribute,
    ParameterAttributes,
    WordBreak,
    ContentNode,
    OnThisPageSection,
    ParametersTable,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    parameters: {
      type: Array,
      required: true,
    },
  },
  computed: {
    anchor: ({ title }) => anchorize(title),
    parameterChanges: ({ apiChanges }) => ((apiChanges || {}).restParameters),
  },
  methods: {
    shouldShiftType: ({ content = [], name }) => (!content.length && name),
  },
};
</script>

<style lang="scss" scoped>
@import 'docc-render/styles/_core.scss';

.param-name {
  font-weight: $font-weight-bold;

  &.deprecated {
    text-decoration: line-through;
  }
}

.param-deprecated {
  margin-left: 0;
}
</style>
