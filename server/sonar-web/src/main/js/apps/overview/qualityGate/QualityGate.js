/*
 * SonarQube
 * Copyright (C) 2009-2018 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
//@flow
import React from 'react';
import QualityGateConditions from './QualityGateConditions';
import EmptyQualityGate from './EmptyQualityGate';
import { translate } from '../../../helpers/l10n';
import Level from '../../../components/ui/Level';
import HelpTooltip from '../../../components/controls/HelpTooltip';
import DocTooltip from '../../../components/docs/DocTooltip';
/*:: import type { Component, MeasuresList } from '../types'; */

function parseQualityGateDetails(rawDetails /*: string */) {
  return JSON.parse(rawDetails);
}

function isProject(component /*: Component */) {
  return component.qualifier === 'TRK';
}

/*::
type Props = {
  branchLike?: {id?: string; name: string },
  component: Component,
  measures: MeasuresList
};
*/

export default function QualityGate({ branchLike, component, measures } /*: Props */) {
  const statusMeasure = measures.find(measure => measure.metric.key === 'alert_status');
  const detailsMeasure = measures.find(measure => measure.metric.key === 'quality_gate_details');

  if (!statusMeasure) {
    return isProject(component) ? <EmptyQualityGate /> : null;
  }

  const level = statusMeasure.value;

  let conditions = [];
  let ignoredConditions = false;
  if (detailsMeasure && detailsMeasure.value) {
    const details = parseQualityGateDetails(detailsMeasure.value);
    conditions = details.conditions || [];
    ignoredConditions = details.ignoredConditions;
  }

  return (
    <div className="overview-quality-gate" id="overview-quality-gate">
      <div className="display-flex-center">
        <h2 className="overview-title">{translate('overview.quality_gate')}</h2>
        <DocTooltip className="spacer-left" doc="quality-gates/project-homepage-quality-gate" />
        <Level className="big-spacer-left" level={level} />
      </div>

      {ignoredConditions && (
        <div className="alert alert-info display-inline-block big-spacer-top">
          <span className="text-middle">
            {translate('overview.quality_gate.ignored_conditions')}
          </span>
          <HelpTooltip
            className="spacer-left"
            overlay={translate('overview.quality_gate.ignored_conditions.tooltip')}
          />
        </div>
      )}

      {conditions.length > 0 && (
        <QualityGateConditions
          branchLike={branchLike}
          component={component}
          conditions={conditions}
        />
      )}
    </div>
  );
}
