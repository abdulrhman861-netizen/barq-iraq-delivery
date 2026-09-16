import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS, FONT_SIZES, SIZES } from '../../constants';
import {
  createOrder,
  getAllowedNextStatuses,
  getArabicOrderStatus,
  getOrderById,
  ORDER_STATUSES,
  PAYMENT_METHODS,
  subscribeOrdersForUser,
  subscribePendingOrders,
  updateOrderStatus,
} from '../../services/firestoreOrders';

const PAYMENT_OPTIONS = [
  { value: PAYMENT_METHODS.CASH, label: 'نقدًا' },
  { value: PAYMENT_METHODS.WALLET, label: 'محفظة' },
  { value: PAYMENT_METHODS.CARD, label: 'بطاقة' },
];

const STATUS_COLORS = {
  [ORDER_STATUSES.NEW]: '#6B7280',
  [ORDER_STATUSES.PENDING]: '#F59E0B',
  [ORDER_STATUSES.ACCEPTED]: '#2563EB',
  [ORDER_STATUSES.PICKED_UP]: '#4F46E5',
  [ORDER_STATUSES.IN_TRANSIT]: '#0891B2',
  [ORDER_STATUSES.DELIVERED]: '#059669',
  [ORDER_STATUSES.CANCELLED]: '#DC2626',
};

const NEXT_ACTION_LABELS = {
  [ORDER_STATUSES.ACCEPTED]: 'قبول',
  [ORDER_STATUSES.PICKED_UP]: 'تم الاستلام',
  [ORDER_STATUSES.IN_TRANSIT]: 'قيد التوصيل',
  [ORDER_STATUSES.DELIVERED]: 'تم التسليم',
  [ORDER_STATUSES.CANCELLED]: 'إلغاء',
};

const formatTime = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('ar-IQ');
};

const toRoleLabel = (role) => {
  if (role === 'captain') return 'كابتن';
  if (role === 'merchant') return 'تاجر';
  if (role === 'employee') return 'موظف';
  if (role === 'admin') return 'مدير';
  return role || 'مستخدم';
};

const CreateOrderPanel = ({ currentUser, setupState }) => {
  const [customerId, setCustomerId] = useState('');
  const [merchantId, setMerchantId] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [feeIqd, setFeeIqd] = useState('3000');
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.CASH);

  const [orders, setOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);

  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingPending, setLoadingPending] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [statusSavingId, setStatusSavingId] = useState('');

  const [lookupOrderId, setLookupOrderId] = useState('');
  const [lookupOrder, setLookupOrder] = useState(null);
  const [lookupLoading, setLookupLoading] = useState(false);

  const [feedbackError, setFeedbackError] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState('');

  const isCaptain = currentUser?.role === 'captain';
  const currentUserId = currentUser?.uid || '';

  useEffect(() => {
    if (!currentUserId) {
      setCustomerId('');
      setMerchantId('');
      return;
    }

    setCustomerId(currentUserId);
    setMerchantId(currentUser?.role === 'merchant' ? currentUserId : '');
  }, [currentUser?.role, currentUserId]);

  useEffect(() => {
    if (!setupState.isConfigured || !currentUserId) {
      setLoadingOrders(false);
      setOrders([]);
      return undefined;
    }

    setLoadingOrders(true);
    return subscribeOrdersForUser(
      currentUserId,
      (nextOrders) => {
        setOrders(nextOrders);
        setLoadingOrders(false);
      },
      (snapshotError) => {
        setFeedbackError(snapshotError.message);
        setLoadingOrders(false);
      }
    );
  }, [currentUserId, setupState.isConfigured]);

  useEffect(() => {
    if (!setupState.isConfigured || !isCaptain) {
      setPendingOrders([]);
      setLoadingPending(false);
      return undefined;
    }

    setLoadingPending(true);
    return subscribePendingOrders(
      (nextPending) => {
        setPendingOrders(nextPending.filter((item) => !item.assignedCaptainId));
        setLoadingPending(false);
      },
      (snapshotError) => {
        setFeedbackError(snapshotError.message);
        setLoadingPending(false);
      }
    );
  }, [isCaptain, setupState.isConfigured]);

  const assignedCaptainOrders = useMemo(
    () =>
      orders.filter(
        (order) =>
          order.assignedCaptainId === currentUserId &&
          ![ORDER_STATUSES.DELIVERED, ORDER_STATUSES.CANCELLED].includes(order.status)
      ),
    [currentUserId, orders]
  );

  const visibleHistoryOrders = useMemo(() => {
    if (!isCaptain) return orders;
    return orders.filter(
      (order) => !(order.status === ORDER_STATUSES.PENDING && !order.assignedCaptainId)
    );
  }, [isCaptain, orders]);

  const resetCreateForm = () => {
    setPickupAddress('');
    setDeliveryAddress('');
    setNotes('');
    setFeeIqd('3000');
    setPaymentMethod(PAYMENT_METHODS.CASH);
  };

  const handleCreateOrder = async () => {
    try {
      setSavingOrder(true);
      setFeedbackError('');
      setFeedbackSuccess('');

      const createdId = await createOrder({
        currentUser,
        customerId,
        merchantId,
        pickupAddress,
        deliveryAddress,
        notes,
        feeIqd,
        paymentMethod,
      });

      resetCreateForm();
      setLookupOrderId(createdId);
      setFeedbackSuccess(`تم إنشاء الطلب بنجاح: ${createdId}`);
    } catch (submitError) {
      setFeedbackError(submitError.message || 'تعذر إنشاء الطلب.');
      setFeedbackSuccess('');
    } finally {
      setSavingOrder(false);
    }
  };

  const handleStatusUpdate = async (order, nextStatus) => {
    try {
      setStatusSavingId(`${order.id}:${nextStatus}`);
      setFeedbackError('');
      setFeedbackSuccess('');

      await updateOrderStatus({
        orderId: order.id,
        nextStatus,
        actor: currentUser,
      });

      setFeedbackSuccess(
        `تم تحديث الطلب ${order.id} إلى ${getArabicOrderStatus(nextStatus)} بنجاح.`
      );
    } catch (updateError) {
      setFeedbackError(updateError.message || 'تعذر تحديث حالة الطلب.');
      setFeedbackSuccess('');
    } finally {
      setStatusSavingId('');
    }
  };

  const handleLookupOrder = async () => {
    try {
      setLookupLoading(true);
      setFeedbackError('');
      setLookupOrder(null);
      const foundOrder = await getOrderById(lookupOrderId, currentUser);
      if (!foundOrder) {
        setFeedbackError('لا يوجد طلب بهذا المعرّف.');
        return;
      }
      setLookupOrder(foundOrder);
    } catch (lookupError) {
      setFeedbackError(lookupError.message || 'تعذر جلب الطلب.');
    } finally {
      setLookupLoading(false);
    }
  };

  const handleManualRefresh = async () => {
    if (lookupOrderId.trim()) {
      await handleLookupOrder();
      return;
    }
    setFeedbackSuccess('القوائم محدثة لحظيًا عبر Firebase.');
    setFeedbackError('');
  };

  const getVisibleActions = (order) => {
    const allowed = getAllowedNextStatuses(order.status);
    const isAdmin = currentUser?.role === 'admin';

    if (isAdmin) return allowed;

    if (isCaptain && order.assignedCaptainId === currentUserId) {
      return allowed.filter((status) => status !== ORDER_STATUSES.ACCEPTED);
    }

    if (isCaptain) return [];

    if ([ORDER_STATUSES.DELIVERED, ORDER_STATUSES.CANCELLED].includes(order.status)) {
      return [];
    }

    return allowed.filter((status) => status === ORDER_STATUSES.CANCELLED);
  };

  const renderOrderCard = (order, { showActions = true } = {}) => {
    const nextActions = showActions ? getVisibleActions(order) : [];

    return (
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.cardTitle}>طلب #{order.id}</Text>
          <View style={[styles.badge, { backgroundColor: STATUS_COLORS[order.status] || COLORS.gray }]}>
            <Text style={styles.badgeText}>{getArabicOrderStatus(order.status)}</Text>
          </View>
        </View>

        <Text style={styles.cardLine}>رسوم التوصيل: {Number(order.feeIqd || 0)} د.ع</Text>
        <Text style={styles.cardLine}>عنوان الاستلام: {order.pickup?.address || '—'}</Text>
        <Text style={styles.cardLine}>عنوان التسليم: {order.delivery?.address || '—'}</Text>
        <Text style={styles.cardLine}>طريقة الدفع: {PAYMENT_OPTIONS.find((item) => item.value === order.paymentMethod)?.label || order.paymentMethod || '—'}</Text>
        <Text style={styles.cardLine}>منشئ الطلب: {order.createdBy || '—'}</Text>
        <Text style={styles.cardLine}>التاجر: {order.merchantId || '—'}</Text>
        <Text style={styles.cardLine}>العميل: {order.customerId || '—'}</Text>
        <Text style={styles.cardLine}>الكابتن: {order.assignedCaptainId || 'غير معيّن'}</Text>
        <Text style={styles.cardLine}>آخر تحديث: {formatTime(order.updatedAt)}</Text>
        <Text style={styles.cardLine}>الإنشاء: {formatTime(order.createdAt)}</Text>

        {nextActions.length > 0 && (
          <View style={styles.actionsRow}>
            {nextActions.map((nextStatus) => {
              const isSaving = statusSavingId === `${order.id}:${nextStatus}`;
              return (
                <TouchableOpacity
                  key={`${order.id}-${nextStatus}`}
                  style={[
                    styles.actionButton,
                    nextStatus === ORDER_STATUSES.CANCELLED && styles.actionButtonDanger,
                  ]}
                  onPress={() => handleStatusUpdate(order, nextStatus)}
                  disabled={Boolean(statusSavingId)}
                >
                  <Text style={styles.actionButtonText}>
                    {isSaving ? '...' : NEXT_ACTION_LABELS[nextStatus] || getArabicOrderStatus(nextStatus)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    );
  };

  if (!setupState.isConfigured) {
    return (
      <Text style={styles.placeholder}>
        لتفعيل الطلبات الحقيقية، أكمل إعداد Firebase في ملف .env.
      </Text>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>الطلبات والتوصيل ({toRoleLabel(currentUser?.role)})</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={handleManualRefresh}>
          <Text style={styles.refreshText}>تحديث</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formBox}>
        <Text style={styles.subTitle}>إنشاء طلب جديد</Text>
        <TextInput
          style={styles.input}
          value={customerId}
          onChangeText={setCustomerId}
          placeholder="معرف العميل"
          placeholderTextColor={COLORS.border}
          textAlign="right"
        />
        <TextInput
          style={styles.input}
          value={merchantId}
          onChangeText={setMerchantId}
          placeholder="معرف التاجر"
          placeholderTextColor={COLORS.border}
          textAlign="right"
        />
        <TextInput
          style={styles.input}
          value={pickupAddress}
          onChangeText={setPickupAddress}
          placeholder="عنوان الاستلام"
          placeholderTextColor={COLORS.border}
          textAlign="right"
        />
        <TextInput
          style={styles.input}
          value={deliveryAddress}
          onChangeText={setDeliveryAddress}
          placeholder="عنوان التسليم"
          placeholderTextColor={COLORS.border}
          textAlign="right"
        />
        <TextInput
          style={styles.input}
          value={feeIqd}
          onChangeText={setFeeIqd}
          placeholder="رسوم التوصيل بالدينار العراقي"
          keyboardType="numeric"
          placeholderTextColor={COLORS.border}
          textAlign="right"
        />

        <View style={styles.paymentRow}>
          {PAYMENT_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.paymentButton,
                paymentMethod === option.value && styles.paymentButtonActive,
              ]}
              onPress={() => setPaymentMethod(option.value)}
            >
              <Text
                style={[
                  styles.paymentButtonText,
                  paymentMethod === option.value && styles.paymentButtonTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={[styles.input, styles.notesInput]}
          value={notes}
          onChangeText={setNotes}
          placeholder="ملاحظات إضافية (اختياري)"
          placeholderTextColor={COLORS.border}
          multiline
          textAlign="right"
        />

        <TouchableOpacity
          style={[styles.button, savingOrder && styles.disabled]}
          onPress={handleCreateOrder}
          disabled={savingOrder}
        >
          <Text style={styles.buttonText}>{savingOrder ? 'جاري الحفظ...' : 'إنشاء الطلب'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formBox}>
        <Text style={styles.subTitle}>البحث عن طلب برقم المعرّف</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.lookupInput]}
            value={lookupOrderId}
            onChangeText={setLookupOrderId}
            placeholder="معرّف الطلب"
            placeholderTextColor={COLORS.border}
            textAlign="right"
          />
          <TouchableOpacity
            style={[styles.button, styles.lookupButton]}
            onPress={handleLookupOrder}
            disabled={lookupLoading || !lookupOrderId.trim()}
          >
            <Text style={styles.buttonText}>{lookupLoading ? '...' : 'جلب'}</Text>
          </TouchableOpacity>
        </View>
        {lookupOrder ? renderOrderCard(lookupOrder, { showActions: false }) : null}
      </View>

      {feedbackSuccess ? <Text style={styles.success}>{feedbackSuccess}</Text> : null}
      {feedbackError ? <Text style={styles.error}>{feedbackError}</Text> : null}

      {isCaptain && (
        <>
          <Text style={styles.listTitle}>طلبات متاحة للكابتن</Text>
          {loadingPending ? (
            <ActivityIndicator color={COLORS.primary} />
          ) : pendingOrders.length === 0 ? (
            <Text style={styles.empty}>لا توجد طلبات جديدة حالياً.</Text>
          ) : (
            <FlatList
              data={pendingOrders}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View>
                  {renderOrderCard(item, { showActions: false })}
                  <TouchableOpacity
                    style={styles.button}
                    disabled={Boolean(statusSavingId)}
                    onPress={() => handleStatusUpdate(item, ORDER_STATUSES.ACCEPTED)}
                  >
                    <Text style={styles.buttonText}>
                      {statusSavingId === `${item.id}:${ORDER_STATUSES.ACCEPTED}` ? '...' : 'قبول الطلب'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          )}

          <Text style={styles.listTitle}>طلباتي المعيّنة للتوصيل</Text>
          {assignedCaptainOrders.length === 0 ? (
            <Text style={styles.empty}>لا توجد طلبات قيد التنفيذ.</Text>
          ) : (
            <FlatList
              data={assignedCaptainOrders}
              keyExtractor={(item) => `assigned-${item.id}`}
              renderItem={({ item }) => renderOrderCard(item)}
            />
          )}
        </>
      )}

      <Text style={styles.listTitle}>سجل طلباتي</Text>
      {loadingOrders ? (
        <ActivityIndicator color={COLORS.primary} />
      ) : visibleHistoryOrders.length === 0 ? (
        <Text style={styles.empty}>لا توجد طلبات حتى الآن.</Text>
      ) : (
        <FlatList
          data={visibleHistoryOrders}
          keyExtractor={(item) => `history-${item.id}`}
          renderItem={({ item }) => renderOrderCard(item)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    gap: SIZES.sm,
    direction: 'rtl',
  },
  sectionHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.darkGray,
    textAlign: 'right',
  },
  refreshButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: SIZES.sm,
    paddingVertical: 6,
  },
  refreshText: {
    color: COLORS.darkGray,
    fontWeight: '600',
  },
  formBox: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: SIZES.sm,
    gap: SIZES.sm,
  },
  subTitle: {
    color: COLORS.darkGray,
    fontWeight: '700',
    textAlign: 'right',
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: SIZES.sm,
    color: COLORS.darkGray,
  },
  notesInput: {
    minHeight: 66,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: SIZES.sm,
  },
  lookupInput: {
    flex: 1,
  },
  lookupButton: {
    width: 80,
  },
  paymentRow: {
    flexDirection: 'row-reverse',
    gap: SIZES.sm,
  },
  paymentButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingVertical: SIZES.sm,
    alignItems: 'center',
  },
  paymentButtonActive: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  paymentButtonText: {
    color: COLORS.darkGray,
    fontWeight: '600',
  },
  paymentButtonTextActive: {
    color: COLORS.white,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: SIZES.sm,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.6,
  },
  success: {
    color: COLORS.success,
    textAlign: 'right',
  },
  error: {
    color: COLORS.danger,
    textAlign: 'right',
  },
  listTitle: {
    color: COLORS.darkGray,
    fontWeight: '700',
    textAlign: 'right',
    marginTop: SIZES.sm,
  },
  empty: {
    color: COLORS.gray,
    textAlign: 'right',
  },
  card: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: SIZES.sm,
    marginBottom: SIZES.sm,
    gap: 4,
  },
  rowBetween: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    color: COLORS.darkGray,
    fontWeight: '700',
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: SIZES.sm,
    paddingVertical: 4,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
  },
  cardLine: {
    color: COLORS.darkGray,
    textAlign: 'right',
  },
  actionsRow: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: SIZES.sm,
    marginTop: SIZES.xs,
  },
  actionButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: SIZES.sm,
  },
  actionButtonDanger: {
    backgroundColor: COLORS.danger,
  },
  actionButtonText: {
    color: COLORS.white,
    fontWeight: '700',
  },
  placeholder: {
    color: COLORS.gray,
    textAlign: 'right',
  },
});

export default CreateOrderPanel;
