import React, {useCallback, useMemo} from 'react';
import HeaderWithBackButton from '@components/HeaderWithBackButton';
import ScreenWrapper from '@components/ScreenWrapper';
import ScrollView from '@components/ScrollView';
import SelectionList from '@components/SelectionList';
import RadioListItem from '@components/SelectionList/RadioListItem';
import type {ListItem} from '@components/SelectionList/types';
import Text from '@components/Text';
import useLocalize from '@hooks/useLocalize';
import useThemeStyles from '@hooks/useThemeStyles';
import * as Connections from '@libs/actions/connections';
import Navigation from '@navigation/Navigation';
import withPolicy from '@pages/workspace/withPolicy';
import type {WithPolicyProps} from '@pages/workspace/withPolicy';
import CONST from '@src/CONST';
import ROUTES from '@src/ROUTES';

// TODO - should be removed after API fully working
const draft = [
    {
        name: 'Accounts Payable (A/P)',
    },
    {
        name: 'Payroll Accounts',
    },
];

type CardListItem = ListItem & {
    value: string;
};

function QuickbooksOutOfPocketExpenseAccountSelectPage({policy}: WithPolicyProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();
    const {bankAccounts, journalEntryAccounts, accountsPayable} = policy?.connections?.quickbooksOnline?.data ?? {};

    const {exportEntity, exportAccount} = policy?.connections?.quickbooksOnline?.config ?? {};

    const data: CardListItem[] = useMemo(() => {
        let result;
        switch (exportEntity) {
            case CONST.QUICKBOOKS_EXPORT_ENTITY.CHECK:
                result = bankAccounts ?? [];
                break;
            case CONST.QUICKBOOKS_EXPORT_ENTITY.VENDOR_BILL:
                result = accountsPayable ?? [];
                break;
            case CONST.QUICKBOOKS_EXPORT_ENTITY.JOURNAL_ENTRY:
                result = journalEntryAccounts ?? [];
                break;
            default:
                result = draft;
        }

        return (draft ?? result)?.map((card) => ({
            value: card.name,
            text: card.name,
            keyForList: card.name,
            isSelected: card.name === exportAccount,
        }));
    }, [accountsPayable, bankAccounts, exportAccount, exportEntity, journalEntryAccounts]);

    const policyID = policy?.id ?? '';

    const onSelectRow = useCallback(
        (row: CardListItem) => {
            if (row.value !== exportAccount) {
                Connections.updatePolicyConnectionConfig(policyID, CONST.POLICY.CONNECTIONS.NAME.QBO, CONST.QUICK_BOOKS_CONFIG.EXPORT_ACCOUNT, row.value);
            }
            Navigation.goBack(ROUTES.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_EXPORT_OUT_OF_POCKET_EXPENSES.getRoute(policyID));
        },
        [exportAccount, policyID],
    );

    return (
        <ScreenWrapper
            includeSafeAreaPaddingBottom={false}
            testID={QuickbooksOutOfPocketExpenseAccountSelectPage.displayName}
        >
            <HeaderWithBackButton title={translate('workspace.qbo.accountsPayable')} />
            <ScrollView contentContainerStyle={styles.pb2}>
                <SelectionList
                    headerContent={<Text style={[styles.ph5, styles.pb5]}>{translate('workspace.qbo.accountsPayableDescription')}</Text>}
                    sections={[{data}]}
                    ListItem={RadioListItem}
                    onSelectRow={onSelectRow}
                    initiallyFocusedOptionKey={data.find((mode) => mode.isSelected)?.keyForList}
                />
            </ScrollView>
        </ScreenWrapper>
    );
}

QuickbooksOutOfPocketExpenseAccountSelectPage.displayName = 'QuickbooksOutOfPocketExpenseAccountSelectPage';

export default withPolicy(QuickbooksOutOfPocketExpenseAccountSelectPage);
