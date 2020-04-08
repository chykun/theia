/********************************************************************************
 * Copyright (C) 2019 Arm and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import { ContainerModule, inject, injectable } from 'inversify';
import { bindDynamicLabelProvider } from './label/sample-dynamic-label-provider-command-contribution';
import { bindSampleUnclosableView } from './view/sample-unclosable-view-contribution';
import { CommandRegistry, CommandContribution } from '@theia/core/lib/common/command';
import { OutputChannelManager } from '@theia/output/lib/common/output-channel';

export default new ContainerModule(bind => {
    bindDynamicLabelProvider(bind);
    bindSampleUnclosableView(bind);
    bind(CommandContribution).to(LogToOutputChannelCommandContribution).inSingletonScope();
});

@injectable()
class LogToOutputChannelCommandContribution implements CommandContribution {

    private timer?: number;

    @inject(OutputChannelManager)
    private readonly ocm: OutputChannelManager;

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand({ id: 'log-to-output-channel', label: 'API Sample: Log to Output' }, {
            execute: () => {
                if (this.timer) {
                    clearInterval(this.timer);
                } else {
                    this.timer = window.setInterval(() => {
                        const channel = this.ocm.getChannel('API Sample');
                        channel.setVisibility(true);
                        channel.appendLine(`${Date.now()}`);
                    }, 1000);
                }
            }
        });
    }

}
