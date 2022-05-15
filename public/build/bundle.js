
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function _mergeNamespaces(n, m) {
        m.forEach(function (e) {
            e && typeof e !== 'string' && !Array.isArray(e) && Object.keys(e).forEach(function (k) {
                if (k !== 'default' && !(k in n)) {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () { return e[k]; }
                    });
                }
            });
        });
        return Object.freeze(n);
    }

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function time_ranges_to_array(ranges) {
        const array = [];
        for (let i = 0; i < ranges.length; i += 1) {
            array.push({ start: ranges.start(i), end: ranges.end(i) });
        }
        return array;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    // unfortunately this can't be a constant as that wouldn't be tree-shakeable
    // so we cache the result instead
    let crossorigin;
    function is_crossorigin() {
        if (crossorigin === undefined) {
            crossorigin = false;
            try {
                if (typeof window !== 'undefined' && window.parent) {
                    void window.parent.document;
                }
            }
            catch (error) {
                crossorigin = true;
            }
        }
        return crossorigin;
    }
    function add_resize_listener(node, fn) {
        const computed_style = getComputedStyle(node);
        if (computed_style.position === 'static') {
            node.style.position = 'relative';
        }
        const iframe = element('iframe');
        iframe.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ' +
            'overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;');
        iframe.setAttribute('aria-hidden', 'true');
        iframe.tabIndex = -1;
        const crossorigin = is_crossorigin();
        let unsubscribe;
        if (crossorigin) {
            iframe.src = "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>";
            unsubscribe = listen(window, 'message', (event) => {
                if (event.source === iframe.contentWindow)
                    fn();
            });
        }
        else {
            iframe.src = 'about:blank';
            iframe.onload = () => {
                unsubscribe = listen(iframe.contentWindow, 'resize', fn);
            };
        }
        append(node, iframe);
        return () => {
            if (crossorigin) {
                unsubscribe();
            }
            else if (unsubscribe && iframe.contentWindow) {
                unsubscribe();
            }
            detach(iframe);
        };
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
        return context;
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }
    function update_await_block_branch(info, ctx, dirty) {
        const child_ctx = ctx.slice();
        const { resolved } = info;
        if (info.current === info.then) {
            child_ctx[info.value] = resolved;
        }
        if (info.current === info.catch) {
            child_ctx[info.error] = resolved;
        }
        info.block.p(child_ctx, dirty);
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.48.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    /* src/tabs/Tabs.svelte generated by Svelte v3.48.0 */
    const file$n = "src/tabs/Tabs.svelte";

    function create_fragment$w(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "tabs");
    			add_location(div, file$n, 47, 0, 1063);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$w.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const TABS = {};

    function instance$w($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tabs', slots, ['default']);
    	const tabs = [];
    	const panels = [];
    	const selectedTab = writable(null);
    	const selectedPanel = writable(null);

    	setContext(TABS, {
    		registerTab: tab => {
    			tabs.push(tab);
    			selectedTab.update(current => current || tab);

    			onDestroy(() => {
    				const i = tabs.indexOf(tab);
    				tabs.splice(i, 1);

    				selectedTab.update(current => current === tab
    				? tabs[i] || tabs[tabs.length - 1]
    				: current);
    			});
    		},
    		registerPanel: panel => {
    			panels.push(panel);
    			selectedPanel.update(current => current || panel);

    			onDestroy(() => {
    				const i = panels.indexOf(panel);
    				panels.splice(i, 1);

    				selectedPanel.update(current => current === panel
    				? panels[i] || panels[panels.length - 1]
    				: current);
    			});
    		},
    		selectTab: tab => {
    			const i = tabs.indexOf(tab);
    			selectedTab.set(tab);
    			selectedPanel.set(panels[i]);
    		},
    		selectedTab,
    		selectedPanel
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tabs> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		TABS,
    		setContext,
    		onDestroy,
    		writable,
    		tabs,
    		panels,
    		selectedTab,
    		selectedPanel
    	});

    	return [$$scope, slots];
    }

    class Tabs extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$w, create_fragment$w, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tabs",
    			options,
    			id: create_fragment$w.name
    		});
    	}
    }

    /* src/tabs/TabList.svelte generated by Svelte v3.48.0 */

    const file$m = "src/tabs/TabList.svelte";

    function create_fragment$v(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "tab-list svelte-10i5kbf");
    			add_location(div, file$m, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$v.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$v($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TabList', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TabList> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class TabList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$v, create_fragment$v, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TabList",
    			options,
    			id: create_fragment$v.name
    		});
    	}
    }

    /* src/tabs/TabPanel.svelte generated by Svelte v3.48.0 */

    // (11:0) {#if $selectedPanel === panel}
    function create_if_block$5(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(11:0) {#if $selectedPanel === panel}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$u(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$selectedPanel*/ ctx[0] === /*panel*/ ctx[1] && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$selectedPanel*/ ctx[0] === /*panel*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$selectedPanel*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$u($$self, $$props, $$invalidate) {
    	let $selectedPanel;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TabPanel', slots, ['default']);
    	const panel = {};
    	const { registerPanel, selectedPanel } = getContext(TABS);
    	validate_store(selectedPanel, 'selectedPanel');
    	component_subscribe($$self, selectedPanel, value => $$invalidate(0, $selectedPanel = value));
    	registerPanel(panel);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TabPanel> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		TABS,
    		panel,
    		registerPanel,
    		selectedPanel,
    		$selectedPanel
    	});

    	return [$selectedPanel, panel, selectedPanel, $$scope, slots];
    }

    class TabPanel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$u, create_fragment$u, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TabPanel",
    			options,
    			id: create_fragment$u.name
    		});
    	}
    }

    /* src/tabs/Tab.svelte generated by Svelte v3.48.0 */
    const file$l = "src/tabs/Tab.svelte";

    function create_fragment$t(ctx) {
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			attr_dev(button, "class", "svelte-17si05l");
    			toggle_class(button, "selected", /*$selectedTab*/ ctx[0] === /*tab*/ ctx[1]);
    			add_location(button, file$l, 57, 0, 1424);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}

    			if (dirty & /*$selectedTab, tab*/ 3) {
    				toggle_class(button, "selected", /*$selectedTab*/ ctx[0] === /*tab*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$t($$self, $$props, $$invalidate) {
    	let $selectedTab;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tab', slots, ['default']);
    	const tab = {};
    	const { registerTab, selectTab, selectedTab } = getContext(TABS);
    	validate_store(selectedTab, 'selectedTab');
    	component_subscribe($$self, selectedTab, value => $$invalidate(0, $selectedTab = value));
    	registerTab(tab);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tab> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => selectTab(tab);

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		TABS,
    		tab,
    		registerTab,
    		selectTab,
    		selectedTab,
    		$selectedTab
    	});

    	return [$selectedTab, tab, selectTab, selectedTab, $$scope, slots, click_handler];
    }

    class Tab extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$t, create_fragment$t, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tab",
    			options,
    			id: create_fragment$t.name
    		});
    	}
    }

    function extensionToMimeType(filename) {
      const mimes = { mp4: 'video/mp4', ogv: 'video/ogg', webm: 'video/webm' };
      const ext = (filename.match(/\.([^.]*?)(?=\?|#|$)/) || [])[1];
      if (ext in mimes) return mimes[ext];
      return;
    }

    function prepareVideoSources(source) {
      let sources;
      if (!source) {
        sources = [];
      } else if (source instanceof Array) {
        sources = source
          .map((item) => {
            const type = extensionToMimeType(item);
            return typeof type === 'undefined' ? { src: item } : { src: item, type };
          })
          .filter((item) => item);
      } else {
        const type = extensionToMimeType(source);
        sources = typeof type === 'undefined' ? [{ src: source }] : [{ src: source, type }];
      }
      return sources;
    }

    function uid() {
      var firstPart = (Math.random() * 46656) | 0;
      var secondPart = (Math.random() * 46656) | 0;
      firstPart = ('000' + firstPart.toString(36)).slice(-3);
      secondPart = ('000' + secondPart.toString(36)).slice(-3);
      return firstPart + secondPart;
    }

    async function preloadImage(url) {
      return new Promise((resolve, reject) => {
        if (url) {
          const image = new Image();
          image.addEventListener(
            'load',
            () => {
              resolve(image);
            },
            { once: true }
          );
          image.addEventListener(
            'error',
            () => {
              resolve();
            },
            { once: true }
          );
          image.src = url;
        } else {
          resolve();
        }
      });
    }

    /* node_modules/svelte-video-player/src/Poster.svelte generated by Svelte v3.48.0 */

    const file$k = "node_modules/svelte-video-player/src/Poster.svelte";

    function create_fragment$s(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*src*/ ctx[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "poster svelte-fde6bj");
    			attr_dev(img, "alt", "poster");
    			attr_dev(img, "onerror", "this.style.display='none'");
    			add_location(img, file$k, 15, 0, 194);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*src*/ 1 && !src_url_equal(img.src, img_src_value = /*src*/ ctx[0])) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Poster', slots, []);
    	let { src } = $$props;
    	const writable_props = ['src'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Poster> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('src' in $$props) $$invalidate(0, src = $$props.src);
    	};

    	$$self.$capture_state = () => ({ src });

    	$$self.$inject_state = $$props => {
    		if ('src' in $$props) $$invalidate(0, src = $$props.src);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [src];
    }

    class Poster extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$s, create_fragment$s, safe_not_equal, { src: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Poster",
    			options,
    			id: create_fragment$s.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*src*/ ctx[0] === undefined && !('src' in props)) {
    			console.warn("<Poster> was created without expected prop 'src'");
    		}
    	}

    	get src() {
    		throw new Error("<Poster>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set src(value) {
    		throw new Error("<Poster>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-video-player/src/Controls.svelte generated by Svelte v3.48.0 */

    const file$j = "node_modules/svelte-video-player/src/Controls.svelte";

    function create_fragment$r(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "overlay svelte-h6eqmh");
    			add_location(div, file$j, 11, 0, 155);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Controls', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Controls> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Controls extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Controls",
    			options,
    			id: create_fragment$r.name
    		});
    	}
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    /* node_modules/svelte-video-player/src/PlayPauseIcon.svelte generated by Svelte v3.48.0 */
    const file$i = "node_modules/svelte-video-player/src/PlayPauseIcon.svelte";

    function create_fragment$q(ctx) {
    	let div;
    	let svg;
    	let path0;
    	let path0_visibility_value;
    	let path0_stroke_value;
    	let path1;
    	let path1_visibility_value;
    	let path1_fill_value;
    	let path1_stroke_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "visibility", path0_visibility_value = !/*paused*/ ctx[2] ? 'visible' : 'hidden');
    			attr_dev(path0, "d", "M40 29v42M60 29v42");
    			attr_dev(path0, "stroke", path0_stroke_value = /*$cfg*/ ctx[3].iconColor);
    			attr_dev(path0, "stroke-width", "5");
    			add_location(path0, file$i, 22, 4, 426);
    			attr_dev(path1, "visibility", path1_visibility_value = /*paused*/ ctx[2] ? 'visible' : 'hidden');
    			attr_dev(path1, "d", "M40 29v42l26-21-26-21z");
    			attr_dev(path1, "fill", path1_fill_value = /*filled*/ ctx[1] ? /*$cfg*/ ctx[3].iconColor : 'none');
    			attr_dev(path1, "stroke", path1_stroke_value = /*$cfg*/ ctx[3].iconColor);
    			attr_dev(path1, "stroke-width", "5");
    			add_location(path1, file$i, 27, 4, 576);
    			attr_dev(svg, "viewBox", "0 0 100 100");
    			attr_dev(svg, "width", "100%");
    			attr_dev(svg, "stroke-linecap", "round");
    			attr_dev(svg, "stroke-linejoin", "round");
    			add_location(svg, file$i, 17, 2, 313);
    			attr_dev(div, "class", "play-pause-icon svelte-1na3hbp");
    			set_style(div, "width", /*size*/ ctx[0]);
    			add_location(div, file$i, 16, 0, 258);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*paused*/ 4 && path0_visibility_value !== (path0_visibility_value = !/*paused*/ ctx[2] ? 'visible' : 'hidden')) {
    				attr_dev(path0, "visibility", path0_visibility_value);
    			}

    			if (dirty & /*$cfg*/ 8 && path0_stroke_value !== (path0_stroke_value = /*$cfg*/ ctx[3].iconColor)) {
    				attr_dev(path0, "stroke", path0_stroke_value);
    			}

    			if (dirty & /*paused*/ 4 && path1_visibility_value !== (path1_visibility_value = /*paused*/ ctx[2] ? 'visible' : 'hidden')) {
    				attr_dev(path1, "visibility", path1_visibility_value);
    			}

    			if (dirty & /*filled, $cfg*/ 10 && path1_fill_value !== (path1_fill_value = /*filled*/ ctx[1] ? /*$cfg*/ ctx[3].iconColor : 'none')) {
    				attr_dev(path1, "fill", path1_fill_value);
    			}

    			if (dirty & /*$cfg*/ 8 && path1_stroke_value !== (path1_stroke_value = /*$cfg*/ ctx[3].iconColor)) {
    				attr_dev(path1, "stroke", path1_stroke_value);
    			}

    			if (dirty & /*size*/ 1) {
    				set_style(div, "width", /*size*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	let $cfg;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PlayPauseIcon', slots, []);
    	let { size = "100%" } = $$props;
    	let { filled = false } = $$props;
    	let { paused } = $$props;
    	const cfg = getContext("config");
    	validate_store(cfg, 'cfg');
    	component_subscribe($$self, cfg, value => $$invalidate(3, $cfg = value));
    	const writable_props = ['size', 'filled', 'paused'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PlayPauseIcon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('filled' in $$props) $$invalidate(1, filled = $$props.filled);
    		if ('paused' in $$props) $$invalidate(2, paused = $$props.paused);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		size,
    		filled,
    		paused,
    		cfg,
    		$cfg
    	});

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('filled' in $$props) $$invalidate(1, filled = $$props.filled);
    		if ('paused' in $$props) $$invalidate(2, paused = $$props.paused);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, filled, paused, $cfg, cfg];
    }

    class PlayPauseIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, { size: 0, filled: 1, paused: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PlayPauseIcon",
    			options,
    			id: create_fragment$q.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*paused*/ ctx[2] === undefined && !('paused' in props)) {
    			console.warn("<PlayPauseIcon> was created without expected prop 'paused'");
    		}
    	}

    	get size() {
    		throw new Error("<PlayPauseIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<PlayPauseIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get filled() {
    		throw new Error("<PlayPauseIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filled(value) {
    		throw new Error("<PlayPauseIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get paused() {
    		throw new Error("<PlayPauseIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set paused(value) {
    		throw new Error("<PlayPauseIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-video-player/src/PlayIconCenter.svelte generated by Svelte v3.48.0 */
    const file$h = "node_modules/svelte-video-player/src/PlayIconCenter.svelte";

    // (23:0) {#if !hidden}
    function create_if_block$4(ctx) {
    	let div;
    	let playpauseicon;
    	let div_transition;
    	let current;
    	playpauseicon = new PlayPauseIcon({ props: { paused: true }, $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(playpauseicon.$$.fragment);
    			attr_dev(div, "class", "player-icon svelte-1yuiuyr");
    			set_style(div, "background-color", /*$cfg*/ ctx[1].color);
    			set_style(div, "border-color", /*$cfg*/ ctx[1].focusColor);
    			add_location(div, file$h, 23, 2, 455);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(playpauseicon, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*$cfg*/ 2) {
    				set_style(div, "background-color", /*$cfg*/ ctx[1].color);
    			}

    			if (!current || dirty & /*$cfg*/ 2) {
    				set_style(div, "border-color", /*$cfg*/ ctx[1].focusColor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(playpauseicon.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fade, { duration: 500 }, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(playpauseicon.$$.fragment, local);
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fade, { duration: 500 }, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(playpauseicon);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(23:0) {#if !hidden}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$p(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = !/*hidden*/ ctx[0] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!/*hidden*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*hidden*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let $cfg;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PlayIconCenter', slots, []);
    	let { hidden } = $$props;
    	const cfg = getContext("config");
    	validate_store(cfg, 'cfg');
    	component_subscribe($$self, cfg, value => $$invalidate(1, $cfg = value));
    	const writable_props = ['hidden'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PlayIconCenter> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('hidden' in $$props) $$invalidate(0, hidden = $$props.hidden);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		fade,
    		PlayPauseIcon,
    		hidden,
    		cfg,
    		$cfg
    	});

    	$$self.$inject_state = $$props => {
    		if ('hidden' in $$props) $$invalidate(0, hidden = $$props.hidden);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [hidden, $cfg, cfg];
    }

    class PlayIconCenter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, { hidden: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PlayIconCenter",
    			options,
    			id: create_fragment$p.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*hidden*/ ctx[0] === undefined && !('hidden' in props)) {
    			console.warn("<PlayIconCenter> was created without expected prop 'hidden'");
    		}
    	}

    	get hidden() {
    		throw new Error("<PlayIconCenter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hidden(value) {
    		throw new Error("<PlayIconCenter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-video-player/src/Spinner.svelte generated by Svelte v3.48.0 */
    const file$g = "node_modules/svelte-video-player/src/Spinner.svelte";

    // (45:0) {#if !hidden}
    function create_if_block$3(ctx) {
    	let div2;
    	let div0;
    	let t;
    	let div1;
    	let div2_intro;
    	let div2_outro;
    	let current;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t = space();
    			div1 = element("div");
    			attr_dev(div0, "class", "circle bg svelte-1q5dh4a");
    			set_style(div0, "border-color", /*color*/ ctx[1]);
    			add_location(div0, file$g, 50, 4, 903);
    			attr_dev(div1, "class", "circle rotating svelte-1q5dh4a");
    			set_style(div1, "border-color", /*color*/ ctx[1] + " " + /*color*/ ctx[1] + " transparent transparent");
    			add_location(div1, file$g, 51, 4, 964);
    			attr_dev(div2, "class", "spinner svelte-1q5dh4a");
    			set_style(div2, "width", /*size*/ ctx[0]);
    			set_style(div2, "height", /*size*/ ctx[0]);
    			add_location(div2, file$g, 45, 2, 750);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t);
    			append_dev(div2, div1);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*color*/ 2) {
    				set_style(div0, "border-color", /*color*/ ctx[1]);
    			}

    			if (!current || dirty & /*color*/ 2) {
    				set_style(div1, "border-color", /*color*/ ctx[1] + " " + /*color*/ ctx[1] + " transparent transparent");
    			}

    			if (!current || dirty & /*size*/ 1) {
    				set_style(div2, "width", /*size*/ ctx[0]);
    			}

    			if (!current || dirty & /*size*/ 1) {
    				set_style(div2, "height", /*size*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (div2_outro) div2_outro.end(1);
    				div2_intro = create_in_transition(div2, fade, { delay: 500, duration: 500 });
    				div2_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (div2_intro) div2_intro.invalidate();
    			div2_outro = create_out_transition(div2, fade, { duration: 100 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (detaching && div2_outro) div2_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(45:0) {#if !hidden}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$o(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = !/*hidden*/ ctx[2] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!/*hidden*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*hidden*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Spinner', slots, []);
    	let { size = "60px" } = $$props;
    	let { color = "#FFF" } = $$props;
    	let { hidden = false } = $$props;
    	const writable_props = ['size', 'color', 'hidden'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Spinner> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    		if ('hidden' in $$props) $$invalidate(2, hidden = $$props.hidden);
    	};

    	$$self.$capture_state = () => ({ fade, size, color, hidden });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    		if ('hidden' in $$props) $$invalidate(2, hidden = $$props.hidden);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, color, hidden];
    }

    class Spinner extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, { size: 0, color: 1, hidden: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Spinner",
    			options,
    			id: create_fragment$o.name
    		});
    	}

    	get size() {
    		throw new Error("<Spinner>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Spinner>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Spinner>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Spinner>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hidden() {
    		throw new Error("<Spinner>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hidden(value) {
    		throw new Error("<Spinner>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-video-player/src/CenterIcons.svelte generated by Svelte v3.48.0 */
    const file$f = "node_modules/svelte-video-player/src/CenterIcons.svelte";

    function create_fragment$n(ctx) {
    	let div;
    	let playiconcenter;
    	let t;
    	let spinner;
    	let div_resize_listener;
    	let current;

    	playiconcenter = new PlayIconCenter({
    			props: { hidden: !/*isIconVisible*/ ctx[2] },
    			$$inline: true
    		});

    	spinner = new Spinner({
    			props: {
    				hidden: !/*isSpinnerVisible*/ ctx[1],
    				color: /*isBuffering*/ ctx[0]
    				? /*$cfg*/ ctx[4].color
    				: /*$cfg*/ ctx[4].iconColor,
    				size: "" + (/*offsetWidth*/ ctx[3] + 10 + "px")
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(playiconcenter.$$.fragment);
    			t = space();
    			create_component(spinner.$$.fragment);
    			attr_dev(div, "class", "center-icons svelte-1s6qb6f");
    			set_style(div, "width", /*$cfg*/ ctx[4].centerIconSize);
    			set_style(div, "height", /*$cfg*/ ctx[4].centerIconSize);
    			add_render_callback(() => /*div_elementresize_handler*/ ctx[6].call(div));
    			add_location(div, file$f, 26, 0, 493);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(playiconcenter, div, null);
    			append_dev(div, t);
    			mount_component(spinner, div, null);
    			div_resize_listener = add_resize_listener(div, /*div_elementresize_handler*/ ctx[6].bind(div));
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const playiconcenter_changes = {};
    			if (dirty & /*isIconVisible*/ 4) playiconcenter_changes.hidden = !/*isIconVisible*/ ctx[2];
    			playiconcenter.$set(playiconcenter_changes);
    			const spinner_changes = {};
    			if (dirty & /*isSpinnerVisible*/ 2) spinner_changes.hidden = !/*isSpinnerVisible*/ ctx[1];

    			if (dirty & /*isBuffering, $cfg*/ 17) spinner_changes.color = /*isBuffering*/ ctx[0]
    			? /*$cfg*/ ctx[4].color
    			: /*$cfg*/ ctx[4].iconColor;

    			if (dirty & /*offsetWidth*/ 8) spinner_changes.size = "" + (/*offsetWidth*/ ctx[3] + 10 + "px");
    			spinner.$set(spinner_changes);

    			if (!current || dirty & /*$cfg*/ 16) {
    				set_style(div, "width", /*$cfg*/ ctx[4].centerIconSize);
    			}

    			if (!current || dirty & /*$cfg*/ 16) {
    				set_style(div, "height", /*$cfg*/ ctx[4].centerIconSize);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(playiconcenter.$$.fragment, local);
    			transition_in(spinner.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(playiconcenter.$$.fragment, local);
    			transition_out(spinner.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(playiconcenter);
    			destroy_component(spinner);
    			div_resize_listener();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let $cfg;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CenterIcons', slots, []);
    	let { isBuffering } = $$props;
    	let { isSpinnerVisible } = $$props;
    	let { isIconVisible } = $$props;
    	let offsetWidth;
    	const cfg = getContext("config");
    	validate_store(cfg, 'cfg');
    	component_subscribe($$self, cfg, value => $$invalidate(4, $cfg = value));
    	const writable_props = ['isBuffering', 'isSpinnerVisible', 'isIconVisible'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CenterIcons> was created with unknown prop '${key}'`);
    	});

    	function div_elementresize_handler() {
    		offsetWidth = this.offsetWidth;
    		$$invalidate(3, offsetWidth);
    	}

    	$$self.$$set = $$props => {
    		if ('isBuffering' in $$props) $$invalidate(0, isBuffering = $$props.isBuffering);
    		if ('isSpinnerVisible' in $$props) $$invalidate(1, isSpinnerVisible = $$props.isSpinnerVisible);
    		if ('isIconVisible' in $$props) $$invalidate(2, isIconVisible = $$props.isIconVisible);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		PlayIconCenter,
    		Spinner,
    		isBuffering,
    		isSpinnerVisible,
    		isIconVisible,
    		offsetWidth,
    		cfg,
    		$cfg
    	});

    	$$self.$inject_state = $$props => {
    		if ('isBuffering' in $$props) $$invalidate(0, isBuffering = $$props.isBuffering);
    		if ('isSpinnerVisible' in $$props) $$invalidate(1, isSpinnerVisible = $$props.isSpinnerVisible);
    		if ('isIconVisible' in $$props) $$invalidate(2, isIconVisible = $$props.isIconVisible);
    		if ('offsetWidth' in $$props) $$invalidate(3, offsetWidth = $$props.offsetWidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		isBuffering,
    		isSpinnerVisible,
    		isIconVisible,
    		offsetWidth,
    		$cfg,
    		cfg,
    		div_elementresize_handler
    	];
    }

    class CenterIcons extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {
    			isBuffering: 0,
    			isSpinnerVisible: 1,
    			isIconVisible: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CenterIcons",
    			options,
    			id: create_fragment$n.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*isBuffering*/ ctx[0] === undefined && !('isBuffering' in props)) {
    			console.warn("<CenterIcons> was created without expected prop 'isBuffering'");
    		}

    		if (/*isSpinnerVisible*/ ctx[1] === undefined && !('isSpinnerVisible' in props)) {
    			console.warn("<CenterIcons> was created without expected prop 'isSpinnerVisible'");
    		}

    		if (/*isIconVisible*/ ctx[2] === undefined && !('isIconVisible' in props)) {
    			console.warn("<CenterIcons> was created without expected prop 'isIconVisible'");
    		}
    	}

    	get isBuffering() {
    		throw new Error("<CenterIcons>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isBuffering(value) {
    		throw new Error("<CenterIcons>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isSpinnerVisible() {
    		throw new Error("<CenterIcons>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isSpinnerVisible(value) {
    		throw new Error("<CenterIcons>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isIconVisible() {
    		throw new Error("<CenterIcons>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isIconVisible(value) {
    		throw new Error("<CenterIcons>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-video-player/src/BottomControls.svelte generated by Svelte v3.48.0 */
    const file$e = "node_modules/svelte-video-player/src/BottomControls.svelte";

    function create_fragment$m(ctx) {
    	let div;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "controls svelte-do64tg");
    			set_style(div, "height", /*$cfg*/ ctx[2].controlsHeight);
    			set_style(div, "background", "linear-gradient(rgba(0,0,0,0), rgba(0,0,0,.2) 80%)");
    			toggle_class(div, "hidden", /*hidden*/ ctx[0]);
    			add_location(div, file$e, 55, 0, 1181);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "pointermove", /*pointermove_handler*/ ctx[10], false, false, false),
    					listen_dev(window, "keydown", /*keydown_handler*/ ctx[11], false, false, false),
    					listen_dev(div, "pointerover", /*onPointerOver*/ ctx[4], false, false, false),
    					listen_dev(div, "pointerout", /*onPointerOut*/ ctx[5], false, false, false),
    					listen_dev(div, "transitionend", /*onTransitionEnd*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*$cfg*/ 4) {
    				set_style(div, "height", /*$cfg*/ ctx[2].controlsHeight);
    			}

    			if (dirty & /*hidden*/ 1) {
    				toggle_class(div, "hidden", /*hidden*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let $cfg;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('BottomControls', slots, ['default']);
    	let { hidden } = $$props;
    	let { isPointerOver } = $$props;
    	const cfg = getContext("config");
    	validate_store(cfg, 'cfg');
    	component_subscribe($$self, cfg, value => $$invalidate(2, $cfg = value));
    	let lastFocusElement;
    	let wasTabDown;

    	function onPointerOver(e) {
    		$$invalidate(7, isPointerOver = true);
    	}

    	function onPointerOut(e) {
    		$$invalidate(7, isPointerOver = false);
    	}

    	function onTransitionEnd(e) {
    		if (e.propertyName == "visibility") {
    			if (!hidden && wasTabDown) {
    				lastFocusElement.focus({ preventScroll: true }); // Restore focus when controls opened by tab press
    			} else {
    				lastFocusElement = document.activeElement;
    			}
    		}
    	}

    	const writable_props = ['hidden', 'isPointerOver'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<BottomControls> was created with unknown prop '${key}'`);
    	});

    	const pointermove_handler = () => $$invalidate(1, wasTabDown = false);
    	const keydown_handler = e => $$invalidate(1, wasTabDown = e.code === 'Tab');

    	$$self.$$set = $$props => {
    		if ('hidden' in $$props) $$invalidate(0, hidden = $$props.hidden);
    		if ('isPointerOver' in $$props) $$invalidate(7, isPointerOver = $$props.isPointerOver);
    		if ('$$scope' in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		hidden,
    		isPointerOver,
    		cfg,
    		lastFocusElement,
    		wasTabDown,
    		onPointerOver,
    		onPointerOut,
    		onTransitionEnd,
    		$cfg
    	});

    	$$self.$inject_state = $$props => {
    		if ('hidden' in $$props) $$invalidate(0, hidden = $$props.hidden);
    		if ('isPointerOver' in $$props) $$invalidate(7, isPointerOver = $$props.isPointerOver);
    		if ('lastFocusElement' in $$props) lastFocusElement = $$props.lastFocusElement;
    		if ('wasTabDown' in $$props) $$invalidate(1, wasTabDown = $$props.wasTabDown);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		hidden,
    		wasTabDown,
    		$cfg,
    		cfg,
    		onPointerOver,
    		onPointerOut,
    		onTransitionEnd,
    		isPointerOver,
    		$$scope,
    		slots,
    		pointermove_handler,
    		keydown_handler
    	];
    }

    class BottomControls extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, { hidden: 0, isPointerOver: 7 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BottomControls",
    			options,
    			id: create_fragment$m.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*hidden*/ ctx[0] === undefined && !('hidden' in props)) {
    			console.warn("<BottomControls> was created without expected prop 'hidden'");
    		}

    		if (/*isPointerOver*/ ctx[7] === undefined && !('isPointerOver' in props)) {
    			console.warn("<BottomControls> was created without expected prop 'isPointerOver'");
    		}
    	}

    	get hidden() {
    		throw new Error("<BottomControls>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hidden(value) {
    		throw new Error("<BottomControls>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isPointerOver() {
    		throw new Error("<BottomControls>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isPointerOver(value) {
    		throw new Error("<BottomControls>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /*!
     * just-throttle
     * Copyright (c) 2016 angus croll The MIT License (MIT)
     */

    function throttle(fn, interval, callFirst) {
      var wait = false;
      var callNow = false;
      return function () {
        callNow = callFirst && !wait;
        var context = this;
        var args = arguments;
        if (!wait) {
          wait = true;
          setTimeout(function () {
            wait = false;
            if (!callFirst) {
              return fn.apply(context, args);
            }
          }, interval);
        }
        if (callNow) {
          callNow = false;
          return fn.apply(this, arguments);
        }
      };
    }

    /* node_modules/svelte-video-player/src/Bar.svelte generated by Svelte v3.48.0 */

    const file$d = "node_modules/svelte-video-player/src/Bar.svelte";

    function create_fragment$l(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "bar svelte-1539bnd");
    			set_style(div, "background-color", /*color*/ ctx[0]);
    			set_style(div, "border-color", /*color*/ ctx[0]);
    			set_style(div, "opacity", /*opacity*/ ctx[1]);
    			set_style(div, "transform", "scaleX(" + /*value*/ ctx[2] + ")");
    			add_location(div, file$d, 18, 0, 295);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 1) {
    				set_style(div, "background-color", /*color*/ ctx[0]);
    			}

    			if (dirty & /*color*/ 1) {
    				set_style(div, "border-color", /*color*/ ctx[0]);
    			}

    			if (dirty & /*opacity*/ 2) {
    				set_style(div, "opacity", /*opacity*/ ctx[1]);
    			}

    			if (dirty & /*value*/ 4) {
    				set_style(div, "transform", "scaleX(" + /*value*/ ctx[2] + ")");
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Bar', slots, []);
    	let { color = "white" } = $$props;
    	let { opacity = 1 } = $$props;
    	let { value = 0 } = $$props;
    	const writable_props = ['color', 'opacity', 'value'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Bar> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('opacity' in $$props) $$invalidate(1, opacity = $$props.opacity);
    		if ('value' in $$props) $$invalidate(2, value = $$props.value);
    	};

    	$$self.$capture_state = () => ({ color, opacity, value });

    	$$self.$inject_state = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('opacity' in $$props) $$invalidate(1, opacity = $$props.opacity);
    		if ('value' in $$props) $$invalidate(2, value = $$props.value);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [color, opacity, value];
    }

    class Bar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, { color: 0, opacity: 1, value: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Bar",
    			options,
    			id: create_fragment$l.name
    		});
    	}

    	get color() {
    		throw new Error("<Bar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Bar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get opacity() {
    		throw new Error("<Bar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set opacity(value) {
    		throw new Error("<Bar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Bar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Bar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-video-player/src/Chunkbar.svelte generated by Svelte v3.48.0 */

    const file$c = "node_modules/svelte-video-player/src/Chunkbar.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (22:2) {#each ranges as range}
    function create_each_block$2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "chunk svelte-mhutnt");
    			set_style(div, "background-color", /*color*/ ctx[0]);
    			set_style(div, "opacity", /*opacity*/ ctx[1]);
    			set_style(div, "transform", "translateX(" + /*range*/ ctx[3].start * 100 + "%) scaleX(" + (/*range*/ ctx[3].end - /*range*/ ctx[3].start) + ")");
    			add_location(div, file$c, 22, 4, 398);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*color*/ 1) {
    				set_style(div, "background-color", /*color*/ ctx[0]);
    			}

    			if (dirty & /*opacity*/ 2) {
    				set_style(div, "opacity", /*opacity*/ ctx[1]);
    			}

    			if (dirty & /*ranges*/ 4) {
    				set_style(div, "transform", "translateX(" + /*range*/ ctx[3].start * 100 + "%) scaleX(" + (/*range*/ ctx[3].end - /*range*/ ctx[3].start) + ")");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(22:2) {#each ranges as range}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let div;
    	let each_value = /*ranges*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "chunk-bar svelte-mhutnt");
    			add_location(div, file$c, 20, 0, 342);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color, opacity, ranges*/ 7) {
    				each_value = /*ranges*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Chunkbar', slots, []);
    	let { color = "white" } = $$props;
    	let { opacity = 1 } = $$props;
    	let { ranges = [] } = $$props;
    	const writable_props = ['color', 'opacity', 'ranges'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Chunkbar> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('opacity' in $$props) $$invalidate(1, opacity = $$props.opacity);
    		if ('ranges' in $$props) $$invalidate(2, ranges = $$props.ranges);
    	};

    	$$self.$capture_state = () => ({ color, opacity, ranges });

    	$$self.$inject_state = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('opacity' in $$props) $$invalidate(1, opacity = $$props.opacity);
    		if ('ranges' in $$props) $$invalidate(2, ranges = $$props.ranges);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [color, opacity, ranges];
    }

    class Chunkbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, { color: 0, opacity: 1, ranges: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Chunkbar",
    			options,
    			id: create_fragment$k.name
    		});
    	}

    	get color() {
    		throw new Error("<Chunkbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Chunkbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get opacity() {
    		throw new Error("<Chunkbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set opacity(value) {
    		throw new Error("<Chunkbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ranges() {
    		throw new Error("<Chunkbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ranges(value) {
    		throw new Error("<Chunkbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-video-player/src/Thumb.svelte generated by Svelte v3.48.0 */
    const file$b = "node_modules/svelte-video-player/src/Thumb.svelte";

    function create_fragment$j(ctx) {
    	let div1;
    	let div0;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			attr_dev(div0, "class", "thumb svelte-kj06qu");
    			set_style(div0, "width", /*$cfg*/ ctx[2].thumbSize);
    			set_style(div0, "height", /*$cfg*/ ctx[2].thumbSize);
    			set_style(div0, "background-color", /*$cfg*/ ctx[2].color);
    			set_style(div0, "border-color", /*$cfg*/ ctx[2].color);
    			toggle_class(div0, "active", /*active*/ ctx[0]);
    			add_location(div0, file$b, 35, 2, 636);
    			attr_dev(div1, "class", "thumb-wrapper svelte-kj06qu");
    			set_style(div1, "transform", "translateX(" + /*tx*/ ctx[1] + "%)");
    			add_location(div1, file$b, 34, 0, 567);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$cfg*/ 4) {
    				set_style(div0, "width", /*$cfg*/ ctx[2].thumbSize);
    			}

    			if (dirty & /*$cfg*/ 4) {
    				set_style(div0, "height", /*$cfg*/ ctx[2].thumbSize);
    			}

    			if (dirty & /*$cfg*/ 4) {
    				set_style(div0, "background-color", /*$cfg*/ ctx[2].color);
    			}

    			if (dirty & /*$cfg*/ 4) {
    				set_style(div0, "border-color", /*$cfg*/ ctx[2].color);
    			}

    			if (dirty & /*active*/ 1) {
    				toggle_class(div0, "active", /*active*/ ctx[0]);
    			}

    			if (dirty & /*tx*/ 2) {
    				set_style(div1, "transform", "translateX(" + /*tx*/ ctx[1] + "%)");
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let tx;
    	let $cfg;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Thumb', slots, []);
    	let { positionValue = 0 } = $$props;
    	let { active = false } = $$props;
    	const cfg = getContext("config");
    	validate_store(cfg, 'cfg');
    	component_subscribe($$self, cfg, value => $$invalidate(2, $cfg = value));
    	const writable_props = ['positionValue', 'active'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Thumb> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('positionValue' in $$props) $$invalidate(4, positionValue = $$props.positionValue);
    		if ('active' in $$props) $$invalidate(0, active = $$props.active);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		positionValue,
    		active,
    		cfg,
    		tx,
    		$cfg
    	});

    	$$self.$inject_state = $$props => {
    		if ('positionValue' in $$props) $$invalidate(4, positionValue = $$props.positionValue);
    		if ('active' in $$props) $$invalidate(0, active = $$props.active);
    		if ('tx' in $$props) $$invalidate(1, tx = $$props.tx);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*positionValue*/ 16) {
    			$$invalidate(1, tx = positionValue * 100);
    		}
    	};

    	return [active, tx, $cfg, cfg, positionValue];
    }

    class Thumb extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, { positionValue: 4, active: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Thumb",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get positionValue() {
    		throw new Error("<Thumb>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set positionValue(value) {
    		throw new Error("<Thumb>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<Thumb>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<Thumb>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-video-player/src/Playbar.svelte generated by Svelte v3.48.0 */
    const file$a = "node_modules/svelte-video-player/src/Playbar.svelte";

    // (147:4) {#if $cfg.chunkBars}
    function create_if_block$2(ctx) {
    	let div;
    	let chunkbar0;
    	let t;
    	let chunkbar1;
    	let current;

    	chunkbar0 = new Chunkbar({
    			props: {
    				color: /*$cfg*/ ctx[1].bufferedColor,
    				opacity: 1,
    				ranges: /*_buffered*/ ctx[4]
    			},
    			$$inline: true
    		});

    	chunkbar1 = new Chunkbar({
    			props: {
    				color: /*$cfg*/ ctx[1].color,
    				opacity: 1,
    				ranges: /*_played*/ ctx[5]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(chunkbar0.$$.fragment);
    			t = space();
    			create_component(chunkbar1.$$.fragment);
    			attr_dev(div, "class", "chunkbars svelte-wdgqi3");
    			add_location(div, file$a, 147, 6, 3507);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(chunkbar0, div, null);
    			append_dev(div, t);
    			mount_component(chunkbar1, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const chunkbar0_changes = {};
    			if (dirty & /*$cfg*/ 2) chunkbar0_changes.color = /*$cfg*/ ctx[1].bufferedColor;
    			if (dirty & /*_buffered*/ 16) chunkbar0_changes.ranges = /*_buffered*/ ctx[4];
    			chunkbar0.$set(chunkbar0_changes);
    			const chunkbar1_changes = {};
    			if (dirty & /*$cfg*/ 2) chunkbar1_changes.color = /*$cfg*/ ctx[1].color;
    			if (dirty & /*_played*/ 32) chunkbar1_changes.ranges = /*_played*/ ctx[5];
    			chunkbar1.$set(chunkbar1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chunkbar0.$$.fragment, local);
    			transition_in(chunkbar1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chunkbar0.$$.fragment, local);
    			transition_out(chunkbar1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(chunkbar0);
    			destroy_component(chunkbar1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(147:4) {#if $cfg.chunkBars}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let div1;
    	let div0;
    	let bar0;
    	let t0;
    	let bar1;
    	let t1;
    	let t2;
    	let thumb;
    	let current;
    	let mounted;
    	let dispose;

    	bar0 = new Bar({
    			props: {
    				color: /*$cfg*/ ctx[1].barsBgColor,
    				opacity: 1,
    				value: 1
    			},
    			$$inline: true
    		});

    	bar1 = new Bar({
    			props: {
    				color: /*$cfg*/ ctx[1].color,
    				value: /*_currentTimePercentage*/ ctx[6]
    			},
    			$$inline: true
    		});

    	let if_block = /*$cfg*/ ctx[1].chunkBars && create_if_block$2(ctx);

    	thumb = new Thumb({
    			props: {
    				positionValue: /*_currentTimePercentage*/ ctx[6],
    				active: /*isPointerDown*/ ctx[3]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(bar0.$$.fragment);
    			t0 = space();
    			create_component(bar1.$$.fragment);
    			t1 = space();
    			if (if_block) if_block.c();
    			t2 = space();
    			create_component(thumb.$$.fragment);
    			attr_dev(div0, "class", "bars svelte-wdgqi3");
    			set_style(div0, "height", /*$cfg*/ ctx[1].trackHeight);
    			set_style(div0, "outline-color", /*$cfg*/ ctx[1].focusColor);
    			add_location(div0, file$a, 141, 2, 3254);
    			attr_dev(div1, "class", "playbar svelte-wdgqi3");
    			attr_dev(div1, "tabindex", "0");
    			set_style(div1, "margin", "0 " + /*marginX*/ ctx[0]);
    			add_location(div1, file$a, 135, 0, 3115);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(bar0, div0, null);
    			append_dev(div0, t0);
    			mount_component(bar1, div0, null);
    			append_dev(div0, t1);
    			if (if_block) if_block.m(div0, null);
    			append_dev(div1, t2);
    			mount_component(thumb, div1, null);
    			/*div1_binding*/ ctx[18](div1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "pointermove", /*onPointerMove*/ ctx[9], false, false, false),
    					listen_dev(window, "pointerup", /*onPointerUp*/ ctx[10], false, false, false),
    					listen_dev(div1, "pointerdown", /*onPointerDown*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const bar0_changes = {};
    			if (dirty & /*$cfg*/ 2) bar0_changes.color = /*$cfg*/ ctx[1].barsBgColor;
    			bar0.$set(bar0_changes);
    			const bar1_changes = {};
    			if (dirty & /*$cfg*/ 2) bar1_changes.color = /*$cfg*/ ctx[1].color;
    			if (dirty & /*_currentTimePercentage*/ 64) bar1_changes.value = /*_currentTimePercentage*/ ctx[6];
    			bar1.$set(bar1_changes);

    			if (/*$cfg*/ ctx[1].chunkBars) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$cfg*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div0, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*$cfg*/ 2) {
    				set_style(div0, "height", /*$cfg*/ ctx[1].trackHeight);
    			}

    			if (!current || dirty & /*$cfg*/ 2) {
    				set_style(div0, "outline-color", /*$cfg*/ ctx[1].focusColor);
    			}

    			const thumb_changes = {};
    			if (dirty & /*_currentTimePercentage*/ 64) thumb_changes.positionValue = /*_currentTimePercentage*/ ctx[6];
    			if (dirty & /*isPointerDown*/ 8) thumb_changes.active = /*isPointerDown*/ ctx[3];
    			thumb.$set(thumb_changes);

    			if (!current || dirty & /*marginX*/ 1) {
    				set_style(div1, "margin", "0 " + /*marginX*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(bar0.$$.fragment, local);
    			transition_in(bar1.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(thumb.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(bar0.$$.fragment, local);
    			transition_out(bar1.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(thumb.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(bar0);
    			destroy_component(bar1);
    			if (if_block) if_block.d();
    			destroy_component(thumb);
    			/*div1_binding*/ ctx[18](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let $cfg;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Playbar', slots, []);
    	let { isBottomControlsVisible } = $$props;
    	let { marginX = "10px" } = $$props;
    	let { currentTime = 0 } = $$props;
    	let { duration = 0 } = $$props;
    	let { buffered = [] } = $$props;
    	let { played = [] } = $$props;
    	let { paused } = $$props;
    	let { isScrubbing } = $$props;
    	const dispatch = createEventDispatcher();
    	const cfg = getContext("config");
    	validate_store(cfg, 'cfg');
    	component_subscribe($$self, cfg, value => $$invalidate(1, $cfg = value));
    	let playbarElement;
    	let isPointerDown;
    	let rect;
    	let wasPaused;
    	let _buffered;
    	let _played;
    	let _currentTimePercentage;

    	function updateTime() {
    		$$invalidate(6, _currentTimePercentage = currentTime / duration);
    	}

    	const updateTimeThrottled = throttle(
    		time => {
    			$$invalidate(6, _currentTimePercentage = time / duration);
    		},
    		250,
    		true
    	);

    	const updateChunkBarsThrottled = throttle(
    		time => {
    			$$invalidate(4, _buffered = buffered.map(item => {
    				return {
    					start: item.start / duration,
    					end: item.end / duration
    				};
    			}));

    			$$invalidate(5, _played = played.map(item => {
    				return {
    					start: item.start / duration,
    					end: item.end / duration
    				};
    			}));
    		},
    		250,
    		true
    	);

    	function onPointerDown(e) {
    		e.preventDefault(); // Prevent focusing
    		$$invalidate(3, isPointerDown = true);
    		wasPaused = paused;
    		$$invalidate(13, paused = true);
    		rect = playbarElement.getBoundingClientRect();
    		pointerXToCurrentTime(e.clientX);
    	}

    	function onPointerMove(e) {
    		if (!isPointerDown) return;
    		$$invalidate(12, isScrubbing = true);
    		pointerXToCurrentTime(e.clientX);
    	}

    	function onPointerUp(e) {
    		if (!isPointerDown) return;
    		$$invalidate(13, paused = wasPaused);
    		$$invalidate(3, isPointerDown = false);
    		$$invalidate(12, isScrubbing = false);
    		dispatch("pointerup");
    	}

    	function pointerXToCurrentTime(clientX) {
    		const value = Math.min(Math.max(clientX - rect.x, 0), rect.width) / rect.width;
    		$$invalidate(11, currentTime = duration * value);
    	}

    	const writable_props = [
    		'isBottomControlsVisible',
    		'marginX',
    		'currentTime',
    		'duration',
    		'buffered',
    		'played',
    		'paused',
    		'isScrubbing'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Playbar> was created with unknown prop '${key}'`);
    	});

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			playbarElement = $$value;
    			$$invalidate(2, playbarElement);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('isBottomControlsVisible' in $$props) $$invalidate(14, isBottomControlsVisible = $$props.isBottomControlsVisible);
    		if ('marginX' in $$props) $$invalidate(0, marginX = $$props.marginX);
    		if ('currentTime' in $$props) $$invalidate(11, currentTime = $$props.currentTime);
    		if ('duration' in $$props) $$invalidate(15, duration = $$props.duration);
    		if ('buffered' in $$props) $$invalidate(16, buffered = $$props.buffered);
    		if ('played' in $$props) $$invalidate(17, played = $$props.played);
    		if ('paused' in $$props) $$invalidate(13, paused = $$props.paused);
    		if ('isScrubbing' in $$props) $$invalidate(12, isScrubbing = $$props.isScrubbing);
    	};

    	$$self.$capture_state = () => ({
    		throttle,
    		createEventDispatcher,
    		getContext,
    		Bar,
    		Chunkbar,
    		Thumb,
    		isBottomControlsVisible,
    		marginX,
    		currentTime,
    		duration,
    		buffered,
    		played,
    		paused,
    		isScrubbing,
    		dispatch,
    		cfg,
    		playbarElement,
    		isPointerDown,
    		rect,
    		wasPaused,
    		_buffered,
    		_played,
    		_currentTimePercentage,
    		updateTime,
    		updateTimeThrottled,
    		updateChunkBarsThrottled,
    		onPointerDown,
    		onPointerMove,
    		onPointerUp,
    		pointerXToCurrentTime,
    		$cfg
    	});

    	$$self.$inject_state = $$props => {
    		if ('isBottomControlsVisible' in $$props) $$invalidate(14, isBottomControlsVisible = $$props.isBottomControlsVisible);
    		if ('marginX' in $$props) $$invalidate(0, marginX = $$props.marginX);
    		if ('currentTime' in $$props) $$invalidate(11, currentTime = $$props.currentTime);
    		if ('duration' in $$props) $$invalidate(15, duration = $$props.duration);
    		if ('buffered' in $$props) $$invalidate(16, buffered = $$props.buffered);
    		if ('played' in $$props) $$invalidate(17, played = $$props.played);
    		if ('paused' in $$props) $$invalidate(13, paused = $$props.paused);
    		if ('isScrubbing' in $$props) $$invalidate(12, isScrubbing = $$props.isScrubbing);
    		if ('playbarElement' in $$props) $$invalidate(2, playbarElement = $$props.playbarElement);
    		if ('isPointerDown' in $$props) $$invalidate(3, isPointerDown = $$props.isPointerDown);
    		if ('rect' in $$props) rect = $$props.rect;
    		if ('wasPaused' in $$props) wasPaused = $$props.wasPaused;
    		if ('_buffered' in $$props) $$invalidate(4, _buffered = $$props._buffered);
    		if ('_played' in $$props) $$invalidate(5, _played = $$props._played);
    		if ('_currentTimePercentage' in $$props) $$invalidate(6, _currentTimePercentage = $$props._currentTimePercentage);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*isBottomControlsVisible, $cfg, currentTime*/ 18434) {
    			{
    				if (isBottomControlsVisible && $cfg.chunkBars) {
    					updateChunkBarsThrottled(currentTime); // Optimize with throttle
    				}
    			}
    		}

    		if ($$self.$$.dirty & /*isBottomControlsVisible, isScrubbing, currentTime*/ 22528) {
    			{
    				if (isBottomControlsVisible) {
    					if (isScrubbing) updateTime(); else updateTimeThrottled(currentTime); // Optimize with throttle when playing
    				}
    			}
    		}
    	};

    	return [
    		marginX,
    		$cfg,
    		playbarElement,
    		isPointerDown,
    		_buffered,
    		_played,
    		_currentTimePercentage,
    		cfg,
    		onPointerDown,
    		onPointerMove,
    		onPointerUp,
    		currentTime,
    		isScrubbing,
    		paused,
    		isBottomControlsVisible,
    		duration,
    		buffered,
    		played,
    		div1_binding
    	];
    }

    class Playbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {
    			isBottomControlsVisible: 14,
    			marginX: 0,
    			currentTime: 11,
    			duration: 15,
    			buffered: 16,
    			played: 17,
    			paused: 13,
    			isScrubbing: 12
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Playbar",
    			options,
    			id: create_fragment$i.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*isBottomControlsVisible*/ ctx[14] === undefined && !('isBottomControlsVisible' in props)) {
    			console.warn("<Playbar> was created without expected prop 'isBottomControlsVisible'");
    		}

    		if (/*paused*/ ctx[13] === undefined && !('paused' in props)) {
    			console.warn("<Playbar> was created without expected prop 'paused'");
    		}

    		if (/*isScrubbing*/ ctx[12] === undefined && !('isScrubbing' in props)) {
    			console.warn("<Playbar> was created without expected prop 'isScrubbing'");
    		}
    	}

    	get isBottomControlsVisible() {
    		throw new Error("<Playbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isBottomControlsVisible(value) {
    		throw new Error("<Playbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get marginX() {
    		throw new Error("<Playbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set marginX(value) {
    		throw new Error("<Playbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get currentTime() {
    		throw new Error("<Playbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentTime(value) {
    		throw new Error("<Playbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<Playbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<Playbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get buffered() {
    		throw new Error("<Playbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set buffered(value) {
    		throw new Error("<Playbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get played() {
    		throw new Error("<Playbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set played(value) {
    		throw new Error("<Playbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get paused() {
    		throw new Error("<Playbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set paused(value) {
    		throw new Error("<Playbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isScrubbing() {
    		throw new Error("<Playbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isScrubbing(value) {
    		throw new Error("<Playbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-video-player/src/Button.svelte generated by Svelte v3.48.0 */
    const file$9 = "node_modules/svelte-video-player/src/Button.svelte";

    function create_fragment$h(ctx) {
    	let div;
    	let div_resize_listener;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "button svelte-ievgfv");
    			set_style(div, "width", /*offsetHeight*/ ctx[1] + "px");
    			set_style(div, "min-width", /*offsetHeight*/ ctx[1] + "px");
    			set_style(div, "background-color", /*$cfg*/ ctx[2].color);
    			set_style(div, "border-color", /*$cfg*/ ctx[2].focusColor);
    			set_style(div, "border-radius", /*round*/ ctx[0] ? '9999px' : '10px');
    			attr_dev(div, "tabindex", "0");
    			add_render_callback(() => /*div_elementresize_handler*/ ctx[8].call(div));
    			add_location(div, file$9, 52, 0, 1010);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			div_resize_listener = add_resize_listener(div, /*div_elementresize_handler*/ ctx[8].bind(div));
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "pointerdown", onPointerDown, false, false, false),
    					listen_dev(div, "pointerup", /*onPointerUp*/ ctx[4], false, false, false),
    					listen_dev(div, "keydown", /*onKeydown*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 64)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[6],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[6], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*offsetHeight*/ 2) {
    				set_style(div, "width", /*offsetHeight*/ ctx[1] + "px");
    			}

    			if (!current || dirty & /*offsetHeight*/ 2) {
    				set_style(div, "min-width", /*offsetHeight*/ ctx[1] + "px");
    			}

    			if (!current || dirty & /*$cfg*/ 4) {
    				set_style(div, "background-color", /*$cfg*/ ctx[2].color);
    			}

    			if (!current || dirty & /*$cfg*/ 4) {
    				set_style(div, "border-color", /*$cfg*/ ctx[2].focusColor);
    			}

    			if (!current || dirty & /*round*/ 1) {
    				set_style(div, "border-radius", /*round*/ ctx[0] ? '9999px' : '10px');
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			div_resize_listener();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function onPointerDown(e) {
    	e.preventDefault(); // Prevent focus on pointerdown
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let $cfg;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, ['default']);
    	let { round = false } = $$props;
    	const dispatch = createEventDispatcher();
    	const cfg = getContext("config");
    	validate_store(cfg, 'cfg');
    	component_subscribe($$self, cfg, value => $$invalidate(2, $cfg = value));
    	let offsetHeight;

    	function onPointerUp(e) {
    		dispatch("pointerup");
    	}

    	function onKeydown(e) {
    		switch (e.code) {
    			case "Enter":
    			case "NumpadEnter":
    			case "Space":
    				e.preventDefault();
    				e.stopPropagation();
    				dispatch("pointerup");
    				break;
    		} // Prevent scroll
    	}

    	const writable_props = ['round'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	function div_elementresize_handler() {
    		offsetHeight = this.offsetHeight;
    		$$invalidate(1, offsetHeight);
    	}

    	$$self.$$set = $$props => {
    		if ('round' in $$props) $$invalidate(0, round = $$props.round);
    		if ('$$scope' in $$props) $$invalidate(6, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		getContext,
    		round,
    		dispatch,
    		cfg,
    		offsetHeight,
    		onPointerDown,
    		onPointerUp,
    		onKeydown,
    		$cfg
    	});

    	$$self.$inject_state = $$props => {
    		if ('round' in $$props) $$invalidate(0, round = $$props.round);
    		if ('offsetHeight' in $$props) $$invalidate(1, offsetHeight = $$props.offsetHeight);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		round,
    		offsetHeight,
    		$cfg,
    		cfg,
    		onPointerUp,
    		onKeydown,
    		$$scope,
    		slots,
    		div_elementresize_handler
    	];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, { round: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get round() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set round(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-video-player/src/PlayPauseButton.svelte generated by Svelte v3.48.0 */

    // (8:0) <Button on:pointerup>
    function create_default_slot$4(ctx) {
    	let playpauseicon;
    	let current;

    	playpauseicon = new PlayPauseIcon({
    			props: { paused: /*paused*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(playpauseicon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(playpauseicon, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const playpauseicon_changes = {};
    			if (dirty & /*paused*/ 1) playpauseicon_changes.paused = /*paused*/ ctx[0];
    			playpauseicon.$set(playpauseicon_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(playpauseicon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(playpauseicon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(playpauseicon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(8:0) <Button on:pointerup>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("pointerup", /*pointerup_handler*/ ctx[1]);

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const button_changes = {};

    			if (dirty & /*$$scope, paused*/ 5) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PlayPauseButton', slots, []);
    	let { paused } = $$props;
    	const writable_props = ['paused'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PlayPauseButton> was created with unknown prop '${key}'`);
    	});

    	function pointerup_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('paused' in $$props) $$invalidate(0, paused = $$props.paused);
    	};

    	$$self.$capture_state = () => ({ Button, PlayPauseIcon, paused });

    	$$self.$inject_state = $$props => {
    		if ('paused' in $$props) $$invalidate(0, paused = $$props.paused);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [paused, pointerup_handler];
    }

    class PlayPauseButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { paused: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PlayPauseButton",
    			options,
    			id: create_fragment$g.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*paused*/ ctx[0] === undefined && !('paused' in props)) {
    			console.warn("<PlayPauseButton> was created without expected prop 'paused'");
    		}
    	}

    	get paused() {
    		throw new Error("<PlayPauseButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set paused(value) {
    		throw new Error("<PlayPauseButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-video-player/src/VolumeIcon.svelte generated by Svelte v3.48.0 */
    const file$8 = "node_modules/svelte-video-player/src/VolumeIcon.svelte";

    function create_fragment$f(ctx) {
    	let div;
    	let svg;
    	let g2;
    	let path0;
    	let path0_fill_value;
    	let g0;
    	let path1;
    	let path2;
    	let g0_visibility_value;
    	let g1;
    	let path3;
    	let path4;
    	let g1_visibility_value;
    	let g2_stroke_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			g2 = svg_element("g");
    			path0 = svg_element("path");
    			g0 = svg_element("g");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			g1 = svg_element("g");
    			path3 = svg_element("path");
    			path4 = svg_element("path");
    			attr_dev(path0, "fill", path0_fill_value = /*filled*/ ctx[1] ? /*$cfg*/ ctx[3].iconColor : 'none');
    			attr_dev(path0, "d", "M33.913 38.955l14.58-11.046v44.918l-14.58-11.045H22.154V38.955h11.759z");
    			add_location(path0, file$8, 19, 6, 447);
    			attr_dev(path1, "d", "M68.27 31.776c10.039 10.058 10.039 26.39 0 36.448");
    			add_location(path1, file$8, 23, 8, 652);
    			attr_dev(path2, "d", "M61.062 38.986c6.067 6.079 6.067 15.949 0 22.028");
    			add_location(path2, file$8, 24, 8, 724);
    			attr_dev(g0, "visibility", g0_visibility_value = !/*muted*/ ctx[2] ? 'visible' : 'hidden');
    			add_location(g0, file$8, 22, 6, 596);
    			attr_dev(path3, "d", "M59.644 41.173l17.621 17.658");
    			add_location(path3, file$8, 27, 8, 860);
    			attr_dev(path4, "d", "M77.265 41.173L59.644 58.831");
    			add_location(path4, file$8, 28, 8, 911);
    			attr_dev(g1, "visibility", g1_visibility_value = /*muted*/ ctx[2] ? 'visible' : 'hidden');
    			add_location(g1, file$8, 26, 6, 805);
    			attr_dev(g2, "fill", "none");
    			attr_dev(g2, "stroke", g2_stroke_value = /*$cfg*/ ctx[3].iconColor);
    			attr_dev(g2, "stroke-width", "5");
    			add_location(g2, file$8, 18, 4, 383);
    			attr_dev(svg, "viewBox", "0 0 100 100");
    			attr_dev(svg, "stroke-linecap", "round");
    			attr_dev(svg, "stroke-linejoin", "round");
    			add_location(svg, file$8, 17, 2, 303);
    			attr_dev(div, "class", "volume-icon svelte-rnfp7y");
    			set_style(div, "width", /*size*/ ctx[0]);
    			add_location(div, file$8, 16, 0, 252);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, g2);
    			append_dev(g2, path0);
    			append_dev(g2, g0);
    			append_dev(g0, path1);
    			append_dev(g0, path2);
    			append_dev(g2, g1);
    			append_dev(g1, path3);
    			append_dev(g1, path4);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*filled, $cfg*/ 10 && path0_fill_value !== (path0_fill_value = /*filled*/ ctx[1] ? /*$cfg*/ ctx[3].iconColor : 'none')) {
    				attr_dev(path0, "fill", path0_fill_value);
    			}

    			if (dirty & /*muted*/ 4 && g0_visibility_value !== (g0_visibility_value = !/*muted*/ ctx[2] ? 'visible' : 'hidden')) {
    				attr_dev(g0, "visibility", g0_visibility_value);
    			}

    			if (dirty & /*muted*/ 4 && g1_visibility_value !== (g1_visibility_value = /*muted*/ ctx[2] ? 'visible' : 'hidden')) {
    				attr_dev(g1, "visibility", g1_visibility_value);
    			}

    			if (dirty & /*$cfg*/ 8 && g2_stroke_value !== (g2_stroke_value = /*$cfg*/ ctx[3].iconColor)) {
    				attr_dev(g2, "stroke", g2_stroke_value);
    			}

    			if (dirty & /*size*/ 1) {
    				set_style(div, "width", /*size*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let $cfg;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('VolumeIcon', slots, []);
    	let { size = "100%" } = $$props;
    	let { filled = true } = $$props;
    	let { muted } = $$props;
    	const cfg = getContext("config");
    	validate_store(cfg, 'cfg');
    	component_subscribe($$self, cfg, value => $$invalidate(3, $cfg = value));
    	const writable_props = ['size', 'filled', 'muted'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<VolumeIcon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('filled' in $$props) $$invalidate(1, filled = $$props.filled);
    		if ('muted' in $$props) $$invalidate(2, muted = $$props.muted);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		size,
    		filled,
    		muted,
    		cfg,
    		$cfg
    	});

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('filled' in $$props) $$invalidate(1, filled = $$props.filled);
    		if ('muted' in $$props) $$invalidate(2, muted = $$props.muted);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, filled, muted, $cfg, cfg];
    }

    class VolumeIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { size: 0, filled: 1, muted: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "VolumeIcon",
    			options,
    			id: create_fragment$f.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*muted*/ ctx[2] === undefined && !('muted' in props)) {
    			console.warn("<VolumeIcon> was created without expected prop 'muted'");
    		}
    	}

    	get size() {
    		throw new Error("<VolumeIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<VolumeIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get filled() {
    		throw new Error("<VolumeIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filled(value) {
    		throw new Error("<VolumeIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get muted() {
    		throw new Error("<VolumeIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set muted(value) {
    		throw new Error("<VolumeIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-video-player/src/VolumeButton.svelte generated by Svelte v3.48.0 */

    // (8:0) <Button on:pointerup>
    function create_default_slot$3(ctx) {
    	let volumeicon;
    	let current;

    	volumeicon = new VolumeIcon({
    			props: { muted: /*muted*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(volumeicon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(volumeicon, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const volumeicon_changes = {};
    			if (dirty & /*muted*/ 1) volumeicon_changes.muted = /*muted*/ ctx[0];
    			volumeicon.$set(volumeicon_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(volumeicon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(volumeicon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(volumeicon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(8:0) <Button on:pointerup>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("pointerup", /*pointerup_handler*/ ctx[1]);

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const button_changes = {};

    			if (dirty & /*$$scope, muted*/ 5) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('VolumeButton', slots, []);
    	let { muted } = $$props;
    	const writable_props = ['muted'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<VolumeButton> was created with unknown prop '${key}'`);
    	});

    	function pointerup_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('muted' in $$props) $$invalidate(0, muted = $$props.muted);
    	};

    	$$self.$capture_state = () => ({ Button, VolumeIcon, muted });

    	$$self.$inject_state = $$props => {
    		if ('muted' in $$props) $$invalidate(0, muted = $$props.muted);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [muted, pointerup_handler];
    }

    class VolumeButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { muted: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "VolumeButton",
    			options,
    			id: create_fragment$e.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*muted*/ ctx[0] === undefined && !('muted' in props)) {
    			console.warn("<VolumeButton> was created without expected prop 'muted'");
    		}
    	}

    	get muted() {
    		throw new Error("<VolumeButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set muted(value) {
    		throw new Error("<VolumeButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-video-player/src/Slider.svelte generated by Svelte v3.48.0 */
    const file$7 = "node_modules/svelte-video-player/src/Slider.svelte";

    function create_fragment$d(ctx) {
    	let div1;
    	let div0;
    	let bar0;
    	let t0;
    	let bar1;
    	let t1;
    	let thumb;
    	let current;
    	let mounted;
    	let dispose;

    	bar0 = new Bar({
    			props: {
    				color: /*$cfg*/ ctx[5].barsBgColor,
    				opacity: 1,
    				value: 1
    			},
    			$$inline: true
    		});

    	bar1 = new Bar({
    			props: {
    				color: /*$cfg*/ ctx[5].color,
    				opacity: 1,
    				value: /*value*/ ctx[0]
    			},
    			$$inline: true
    		});

    	thumb = new Thumb({
    			props: {
    				positionValue: /*value*/ ctx[0],
    				active: /*isPointerDown*/ ctx[4]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(bar0.$$.fragment);
    			t0 = space();
    			create_component(bar1.$$.fragment);
    			t1 = space();
    			create_component(thumb.$$.fragment);
    			attr_dev(div0, "class", "bars svelte-1qqqte2");
    			set_style(div0, "height", /*$cfg*/ ctx[5].trackHeight);
    			set_style(div0, "outline-color", /*$cfg*/ ctx[5].focusColor);
    			add_location(div0, file$7, 92, 2, 1989);
    			attr_dev(div1, "class", "slider svelte-1qqqte2");
    			set_style(div1, "max-width", /*width*/ ctx[1]);
    			set_style(div1, "margin", "0 " + /*marginX*/ ctx[2]);
    			attr_dev(div1, "tabindex", "0");
    			add_location(div1, file$7, 85, 0, 1807);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(bar0, div0, null);
    			append_dev(div0, t0);
    			mount_component(bar1, div0, null);
    			append_dev(div1, t1);
    			mount_component(thumb, div1, null);
    			/*div1_binding*/ ctx[11](div1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "pointermove", /*onPointerMove*/ ctx[8], false, false, false),
    					listen_dev(window, "pointerup", /*onPointerUp*/ ctx[9], false, false, false),
    					listen_dev(div1, "pointerdown", /*onPointerDown*/ ctx[7], false, false, false),
    					listen_dev(div1, "keydown", /*onKeydown*/ ctx[10], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const bar0_changes = {};
    			if (dirty & /*$cfg*/ 32) bar0_changes.color = /*$cfg*/ ctx[5].barsBgColor;
    			bar0.$set(bar0_changes);
    			const bar1_changes = {};
    			if (dirty & /*$cfg*/ 32) bar1_changes.color = /*$cfg*/ ctx[5].color;
    			if (dirty & /*value*/ 1) bar1_changes.value = /*value*/ ctx[0];
    			bar1.$set(bar1_changes);

    			if (!current || dirty & /*$cfg*/ 32) {
    				set_style(div0, "height", /*$cfg*/ ctx[5].trackHeight);
    			}

    			if (!current || dirty & /*$cfg*/ 32) {
    				set_style(div0, "outline-color", /*$cfg*/ ctx[5].focusColor);
    			}

    			const thumb_changes = {};
    			if (dirty & /*value*/ 1) thumb_changes.positionValue = /*value*/ ctx[0];
    			if (dirty & /*isPointerDown*/ 16) thumb_changes.active = /*isPointerDown*/ ctx[4];
    			thumb.$set(thumb_changes);

    			if (!current || dirty & /*width*/ 2) {
    				set_style(div1, "max-width", /*width*/ ctx[1]);
    			}

    			if (!current || dirty & /*marginX*/ 4) {
    				set_style(div1, "margin", "0 " + /*marginX*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(bar0.$$.fragment, local);
    			transition_in(bar1.$$.fragment, local);
    			transition_in(thumb.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(bar0.$$.fragment, local);
    			transition_out(bar1.$$.fragment, local);
    			transition_out(thumb.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(bar0);
    			destroy_component(bar1);
    			destroy_component(thumb);
    			/*div1_binding*/ ctx[11](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let $cfg;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Slider', slots, []);
    	let { width = "150px" } = $$props;
    	let { marginX = "10px" } = $$props;
    	let { value = 0.5 } = $$props;
    	let sliderElement;
    	let isPointerDown;
    	let rect;
    	const cfg = getContext("config");
    	validate_store(cfg, 'cfg');
    	component_subscribe($$self, cfg, value => $$invalidate(5, $cfg = value));

    	function onPointerDown(e) {
    		e.preventDefault(); // Prevent focusing
    		$$invalidate(4, isPointerDown = true);
    		rect = sliderElement.getBoundingClientRect();
    		pointerXToValue(e.clientX);
    	}

    	function onPointerMove(e) {
    		if (!isPointerDown) return;
    		pointerXToValue(e.clientX);
    	}

    	function onPointerUp(e) {
    		if (!isPointerDown) return;
    		$$invalidate(4, isPointerDown = false);
    	}

    	function onKeydown(e) {
    		switch (e.code) {
    			case "ArrowLeft":
    			case "ArrowDown":
    				keydownAddToValue(e, -0.1);
    				break;
    			case "ArrowRight":
    			case "ArrowUp":
    				keydownAddToValue(e, 0.1);
    				break;
    		}
    	}

    	function keydownAddToValue(e, v) {
    		e.preventDefault(); // Prevent page scroll
    		e.stopPropagation();
    		$$invalidate(0, value = Math.min(Math.max(value + v, 0), 1));
    	}

    	function pointerXToValue(clientX) {
    		$$invalidate(0, value = Math.min(Math.max(clientX - rect.x, 0), rect.width) / rect.width);
    	}

    	const writable_props = ['width', 'marginX', 'value'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Slider> was created with unknown prop '${key}'`);
    	});

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			sliderElement = $$value;
    			$$invalidate(3, sliderElement);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('width' in $$props) $$invalidate(1, width = $$props.width);
    		if ('marginX' in $$props) $$invalidate(2, marginX = $$props.marginX);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		Thumb,
    		Bar,
    		width,
    		marginX,
    		value,
    		sliderElement,
    		isPointerDown,
    		rect,
    		cfg,
    		onPointerDown,
    		onPointerMove,
    		onPointerUp,
    		onKeydown,
    		keydownAddToValue,
    		pointerXToValue,
    		$cfg
    	});

    	$$self.$inject_state = $$props => {
    		if ('width' in $$props) $$invalidate(1, width = $$props.width);
    		if ('marginX' in $$props) $$invalidate(2, marginX = $$props.marginX);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('sliderElement' in $$props) $$invalidate(3, sliderElement = $$props.sliderElement);
    		if ('isPointerDown' in $$props) $$invalidate(4, isPointerDown = $$props.isPointerDown);
    		if ('rect' in $$props) rect = $$props.rect;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		value,
    		width,
    		marginX,
    		sliderElement,
    		isPointerDown,
    		$cfg,
    		cfg,
    		onPointerDown,
    		onPointerMove,
    		onPointerUp,
    		onKeydown,
    		div1_binding
    	];
    }

    class Slider extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { width: 1, marginX: 2, value: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Slider",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get width() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get marginX() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set marginX(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-video-player/src/VolumeControl.svelte generated by Svelte v3.48.0 */

    function create_fragment$c(ctx) {
    	let slider;
    	let updating_value;
    	let current;

    	function slider_value_binding(value) {
    		/*slider_value_binding*/ ctx[2](value);
    	}

    	let slider_props = { width: /*width*/ ctx[1] };

    	if (/*volume*/ ctx[0] !== void 0) {
    		slider_props.value = /*volume*/ ctx[0];
    	}

    	slider = new Slider({ props: slider_props, $$inline: true });
    	binding_callbacks.push(() => bind(slider, 'value', slider_value_binding));

    	const block = {
    		c: function create() {
    			create_component(slider.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(slider, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const slider_changes = {};
    			if (dirty & /*width*/ 2) slider_changes.width = /*width*/ ctx[1];

    			if (!updating_value && dirty & /*volume*/ 1) {
    				updating_value = true;
    				slider_changes.value = /*volume*/ ctx[0];
    				add_flush_callback(() => updating_value = false);
    			}

    			slider.$set(slider_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(slider.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(slider.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(slider, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('VolumeControl', slots, []);
    	let { width = "100px" } = $$props;
    	let { volume = 1 } = $$props;
    	const writable_props = ['width', 'volume'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<VolumeControl> was created with unknown prop '${key}'`);
    	});

    	function slider_value_binding(value) {
    		volume = value;
    		$$invalidate(0, volume);
    	}

    	$$self.$$set = $$props => {
    		if ('width' in $$props) $$invalidate(1, width = $$props.width);
    		if ('volume' in $$props) $$invalidate(0, volume = $$props.volume);
    	};

    	$$self.$capture_state = () => ({ Slider, width, volume });

    	$$self.$inject_state = $$props => {
    		if ('width' in $$props) $$invalidate(1, width = $$props.width);
    		if ('volume' in $$props) $$invalidate(0, volume = $$props.volume);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [volume, width, slider_value_binding];
    }

    class VolumeControl extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { width: 1, volume: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "VolumeControl",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get width() {
    		throw new Error("<VolumeControl>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<VolumeControl>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get volume() {
    		throw new Error("<VolumeControl>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set volume(value) {
    		throw new Error("<VolumeControl>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-video-player/src/FullscreenIcon.svelte generated by Svelte v3.48.0 */
    const file$6 = "node_modules/svelte-video-player/src/FullscreenIcon.svelte";

    function create_fragment$b(ctx) {
    	let div;
    	let svg;
    	let g2;
    	let g0;
    	let path0;
    	let path1;
    	let path2;
    	let path3;
    	let g0_visibility_value;
    	let g1;
    	let path4;
    	let path5;
    	let path6;
    	let path7;
    	let g1_visibility_value;
    	let g2_stroke_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			g2 = svg_element("g");
    			g0 = svg_element("g");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			path3 = svg_element("path");
    			g1 = svg_element("g");
    			path4 = svg_element("path");
    			path5 = svg_element("path");
    			path6 = svg_element("path");
    			path7 = svg_element("path");
    			attr_dev(path0, "d", "M71 60.5V71H60");
    			add_location(path0, file$6, 19, 8, 496);
    			attr_dev(path1, "d", "M40 71H29V60.5");
    			add_location(path1, file$6, 20, 8, 533);
    			attr_dev(path2, "d", "M29 40.5V29h11");
    			add_location(path2, file$6, 21, 8, 570);
    			attr_dev(path3, "d", "M60 29h11v11.5");
    			add_location(path3, file$6, 22, 8, 607);
    			attr_dev(g0, "visibility", g0_visibility_value = !/*isFullscreen*/ ctx[1] ? 'visible' : 'hidden');
    			add_location(g0, file$6, 18, 6, 433);
    			attr_dev(path4, "d", "M60 71V60.5h11");
    			add_location(path4, file$6, 25, 8, 716);
    			attr_dev(path5, "d", "M29 60.5h11V71");
    			add_location(path5, file$6, 26, 8, 753);
    			attr_dev(path6, "d", "M40 29v11.5H29");
    			add_location(path6, file$6, 27, 8, 790);
    			attr_dev(path7, "d", "M71 40.5H60V29");
    			add_location(path7, file$6, 28, 8, 827);
    			attr_dev(g1, "visibility", g1_visibility_value = /*isFullscreen*/ ctx[1] ? 'visible' : 'hidden');
    			add_location(g1, file$6, 24, 6, 654);
    			attr_dev(g2, "fill", "none");
    			attr_dev(g2, "stroke", g2_stroke_value = /*$cfg*/ ctx[2].iconColor);
    			attr_dev(g2, "stroke-width", "5");
    			add_location(g2, file$6, 17, 4, 369);
    			attr_dev(svg, "viewBox", "0 0 100 100");
    			attr_dev(svg, "stroke-linecap", "round");
    			attr_dev(svg, "stroke-linejoin", "round");
    			add_location(svg, file$6, 16, 2, 289);
    			attr_dev(div, "class", "fullscreen-icon svelte-15g0vgp");
    			set_style(div, "width", /*size*/ ctx[0]);
    			add_location(div, file$6, 15, 0, 234);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, g2);
    			append_dev(g2, g0);
    			append_dev(g0, path0);
    			append_dev(g0, path1);
    			append_dev(g0, path2);
    			append_dev(g0, path3);
    			append_dev(g2, g1);
    			append_dev(g1, path4);
    			append_dev(g1, path5);
    			append_dev(g1, path6);
    			append_dev(g1, path7);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*isFullscreen*/ 2 && g0_visibility_value !== (g0_visibility_value = !/*isFullscreen*/ ctx[1] ? 'visible' : 'hidden')) {
    				attr_dev(g0, "visibility", g0_visibility_value);
    			}

    			if (dirty & /*isFullscreen*/ 2 && g1_visibility_value !== (g1_visibility_value = /*isFullscreen*/ ctx[1] ? 'visible' : 'hidden')) {
    				attr_dev(g1, "visibility", g1_visibility_value);
    			}

    			if (dirty & /*$cfg*/ 4 && g2_stroke_value !== (g2_stroke_value = /*$cfg*/ ctx[2].iconColor)) {
    				attr_dev(g2, "stroke", g2_stroke_value);
    			}

    			if (dirty & /*size*/ 1) {
    				set_style(div, "width", /*size*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let $cfg;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FullscreenIcon', slots, []);
    	let { size = "100%" } = $$props;
    	let { isFullscreen } = $$props;
    	const cfg = getContext("config");
    	validate_store(cfg, 'cfg');
    	component_subscribe($$self, cfg, value => $$invalidate(2, $cfg = value));
    	const writable_props = ['size', 'isFullscreen'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FullscreenIcon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('isFullscreen' in $$props) $$invalidate(1, isFullscreen = $$props.isFullscreen);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		size,
    		isFullscreen,
    		cfg,
    		$cfg
    	});

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('isFullscreen' in $$props) $$invalidate(1, isFullscreen = $$props.isFullscreen);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, isFullscreen, $cfg, cfg];
    }

    class FullscreenIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { size: 0, isFullscreen: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FullscreenIcon",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*isFullscreen*/ ctx[1] === undefined && !('isFullscreen' in props)) {
    			console.warn("<FullscreenIcon> was created without expected prop 'isFullscreen'");
    		}
    	}

    	get size() {
    		throw new Error("<FullscreenIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<FullscreenIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isFullscreen() {
    		throw new Error("<FullscreenIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isFullscreen(value) {
    		throw new Error("<FullscreenIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-video-player/src/FullscreenButton.svelte generated by Svelte v3.48.0 */

    // (8:0) <Button on:pointerup>
    function create_default_slot$2(ctx) {
    	let fullscreenicon;
    	let current;

    	fullscreenicon = new FullscreenIcon({
    			props: { isFullscreen: /*isFullscreen*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(fullscreenicon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fullscreenicon, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const fullscreenicon_changes = {};
    			if (dirty & /*isFullscreen*/ 1) fullscreenicon_changes.isFullscreen = /*isFullscreen*/ ctx[0];
    			fullscreenicon.$set(fullscreenicon_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fullscreenicon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fullscreenicon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fullscreenicon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(8:0) <Button on:pointerup>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("pointerup", /*pointerup_handler*/ ctx[1]);

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const button_changes = {};

    			if (dirty & /*$$scope, isFullscreen*/ 5) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FullscreenButton', slots, []);
    	let { isFullscreen } = $$props;
    	const writable_props = ['isFullscreen'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FullscreenButton> was created with unknown prop '${key}'`);
    	});

    	function pointerup_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('isFullscreen' in $$props) $$invalidate(0, isFullscreen = $$props.isFullscreen);
    	};

    	$$self.$capture_state = () => ({ Button, FullscreenIcon, isFullscreen });

    	$$self.$inject_state = $$props => {
    		if ('isFullscreen' in $$props) $$invalidate(0, isFullscreen = $$props.isFullscreen);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [isFullscreen, pointerup_handler];
    }

    class FullscreenButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { isFullscreen: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FullscreenButton",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*isFullscreen*/ ctx[0] === undefined && !('isFullscreen' in props)) {
    			console.warn("<FullscreenButton> was created without expected prop 'isFullscreen'");
    		}
    	}

    	get isFullscreen() {
    		throw new Error("<FullscreenButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isFullscreen(value) {
    		throw new Error("<FullscreenButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    /*!
     * screenfull
     * v5.1.0 - 2020-12-24
     * (c) Sindre Sorhus; MIT License
     */

    var screenfull = createCommonjsModule(function (module) {
    (function () {

      var document = typeof window !== 'undefined' && typeof window.document !== 'undefined' ? window.document : {};
      var isCommonjs = module.exports;

      var fn = (function () {
        var val;

        var fnMap = [
          [
            'requestFullscreen',
            'exitFullscreen',
            'fullscreenElement',
            'fullscreenEnabled',
            'fullscreenchange',
            'fullscreenerror',
          ],
          // New WebKit
          [
            'webkitRequestFullscreen',
            'webkitExitFullscreen',
            'webkitFullscreenElement',
            'webkitFullscreenEnabled',
            'webkitfullscreenchange',
            'webkitfullscreenerror',
          ],
          // Old WebKit
          [
            'webkitRequestFullScreen',
            'webkitCancelFullScreen',
            'webkitCurrentFullScreenElement',
            'webkitCancelFullScreen',
            'webkitfullscreenchange',
            'webkitfullscreenerror',
          ],
          [
            'mozRequestFullScreen',
            'mozCancelFullScreen',
            'mozFullScreenElement',
            'mozFullScreenEnabled',
            'mozfullscreenchange',
            'mozfullscreenerror',
          ],
          [
            'msRequestFullscreen',
            'msExitFullscreen',
            'msFullscreenElement',
            'msFullscreenEnabled',
            'MSFullscreenChange',
            'MSFullscreenError',
          ],
        ];

        var i = 0;
        var l = fnMap.length;
        var ret = {};

        for (; i < l; i++) {
          val = fnMap[i];
          if (val && val[1] in document) {
            for (i = 0; i < val.length; i++) {
              ret[fnMap[0][i]] = val[i];
            }
            return ret;
          }
        }

        return false;
      })();

      var eventNameMap = {
        change: fn.fullscreenchange,
        error: fn.fullscreenerror,
      };

      var screenfull = {
        request(element, options) {
          return new Promise(
            function (resolve, reject) {
              var onFullScreenEntered = function () {
                this.off('change', onFullScreenEntered);
                resolve();
              }.bind(this);

              this.on('change', onFullScreenEntered);

              element = element || document.documentElement;

              var returnPromise = element[fn.requestFullscreen](options);

              if (returnPromise instanceof Promise) {
                returnPromise.then(onFullScreenEntered).catch(reject);
              }
            }.bind(this)
          );
        },
        exit() {
          return new Promise(
            function (resolve, reject) {
              if (!this.isFullscreen) {
                resolve();
                return;
              }

              var onFullScreenExit = function () {
                this.off('change', onFullScreenExit);
                resolve();
              }.bind(this);

              this.on('change', onFullScreenExit);

              var returnPromise = document[fn.exitFullscreen]();

              if (returnPromise instanceof Promise) {
                returnPromise.then(onFullScreenExit).catch(reject);
              }
            }.bind(this)
          );
        },
        toggle(element, options) {
          return this.isFullscreen ? this.exit() : this.request(element, options);
        },
        onchange(callback) {
          this.on('change', callback);
        },
        onerror(callback) {
          this.on('error', callback);
        },
        on(event, callback) {
          var eventName = eventNameMap[event];
          if (eventName) {
            document.addEventListener(eventName, callback, false);
          }
        },
        off(event, callback) {
          var eventName = eventNameMap[event];
          if (eventName) {
            document.removeEventListener(eventName, callback, false);
          }
        },
        raw: fn,
      };

      if (!fn) {
        if (isCommonjs) {
          module.exports = { isEnabled: false };
        } else {
          window.screenfull = { isEnabled: false };
        }

        return;
      }

      Object.defineProperties(screenfull, {
        isFullscreen: {
          get: function () {
            return Boolean(document[fn.fullscreenElement]);
          },
        },
        element: {
          enumerable: true,
          get: function () {
            return document[fn.fullscreenElement];
          },
        },
        isEnabled: {
          enumerable: true,
          get: function () {
            // Coerce to boolean in case of old WebKit
            return Boolean(document[fn.fullscreenEnabled]);
          },
        },
      });

      if (isCommonjs) {
        module.exports = screenfull;
      } else {
        window.screenfull = screenfull;
      }
    })();
    });

    var screenfull$1 = /*#__PURE__*/_mergeNamespaces({
        __proto__: null,
        'default': screenfull
    }, [screenfull]);

    /* node_modules/svelte-video-player/src/FullscreenManager.svelte generated by Svelte v3.48.0 */

    function create_fragment$9(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FullscreenManager', slots, []);
    	let { element } = $$props;
    	let { isFullscreen } = $$props;
    	let { isFullscreenEnabled } = $$props;
    	isFullscreenEnabled = screenfull.isEnabled;
    	if (isFullscreenEnabled) screenfull.on("change", onChange);

    	function onChange(e) {
    		if (element == e.target) $$invalidate(0, isFullscreen = screenfull.isFullscreen);
    	}

    	onDestroy(() => {
    		screenfull.off("change", onChange);
    	});

    	const writable_props = ['element', 'isFullscreen', 'isFullscreenEnabled'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FullscreenManager> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('element' in $$props) $$invalidate(2, element = $$props.element);
    		if ('isFullscreen' in $$props) $$invalidate(0, isFullscreen = $$props.isFullscreen);
    		if ('isFullscreenEnabled' in $$props) $$invalidate(1, isFullscreenEnabled = $$props.isFullscreenEnabled);
    	};

    	$$self.$capture_state = () => ({
    		onDestroy,
    		screenfull: screenfull$1,
    		element,
    		isFullscreen,
    		isFullscreenEnabled,
    		onChange
    	});

    	$$self.$inject_state = $$props => {
    		if ('element' in $$props) $$invalidate(2, element = $$props.element);
    		if ('isFullscreen' in $$props) $$invalidate(0, isFullscreen = $$props.isFullscreen);
    		if ('isFullscreenEnabled' in $$props) $$invalidate(1, isFullscreenEnabled = $$props.isFullscreenEnabled);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*isFullscreenEnabled, isFullscreen, element*/ 7) {
    			{
    				if (isFullscreenEnabled) isFullscreen
    				? screenfull.request(element)
    				: screenfull.exit();
    			}
    		}
    	};

    	return [isFullscreen, isFullscreenEnabled, element];
    }

    class FullscreenManager extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
    			element: 2,
    			isFullscreen: 0,
    			isFullscreenEnabled: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FullscreenManager",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*element*/ ctx[2] === undefined && !('element' in props)) {
    			console.warn("<FullscreenManager> was created without expected prop 'element'");
    		}

    		if (/*isFullscreen*/ ctx[0] === undefined && !('isFullscreen' in props)) {
    			console.warn("<FullscreenManager> was created without expected prop 'isFullscreen'");
    		}

    		if (/*isFullscreenEnabled*/ ctx[1] === undefined && !('isFullscreenEnabled' in props)) {
    			console.warn("<FullscreenManager> was created without expected prop 'isFullscreenEnabled'");
    		}
    	}

    	get element() {
    		throw new Error("<FullscreenManager>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<FullscreenManager>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isFullscreen() {
    		throw new Error("<FullscreenManager>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isFullscreen(value) {
    		throw new Error("<FullscreenManager>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isFullscreenEnabled() {
    		throw new Error("<FullscreenManager>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isFullscreenEnabled(value) {
    		throw new Error("<FullscreenManager>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /*!
     * just-debounce-it
     * Copyright (c) 2016 angus croll The MIT License (MIT)
     */

    function debounce(fn, wait, callFirst) {
      var timeout;
      return function () {
        if (!wait) {
          return fn.apply(this, arguments);
        }
        var context = this;
        var args = arguments;
        var callNow = callFirst && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
          timeout = null;
          if (!callNow) {
            return fn.apply(context, args);
          }
        }, wait);

        if (callNow) {
          return fn.apply(this, arguments);
        }
      };
    }

    /* node_modules/svelte-video-player/src/IdleDetector.svelte generated by Svelte v3.48.0 */

    function create_fragment$8(ctx) {
    	let mounted;
    	let dispose;

    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "pointermove", /*onActivity*/ ctx[0], false, false, false),
    					listen_dev(window, "keydown", /*onActivity*/ ctx[0], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IdleDetector', slots, []);
    	let { isIdle = false } = $$props;
    	let timeout;

    	function onActivity(e) {
    		$$invalidate(1, isIdle = false);
    		setIdleTimeout();
    	}

    	const setIdleTimeout = debounce(
    		() => {
    			clearTimeout(timeout);

    			timeout = setTimeout(
    				() => {
    					$$invalidate(1, isIdle = true);
    				},
    				2000
    			);
    		},
    		250,
    		true
    	);

    	onDestroy(() => {
    		clearTimeout(timeout);
    	});

    	const writable_props = ['isIdle'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<IdleDetector> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('isIdle' in $$props) $$invalidate(1, isIdle = $$props.isIdle);
    	};

    	$$self.$capture_state = () => ({
    		onDestroy,
    		debounce,
    		isIdle,
    		timeout,
    		onActivity,
    		setIdleTimeout
    	});

    	$$self.$inject_state = $$props => {
    		if ('isIdle' in $$props) $$invalidate(1, isIdle = $$props.isIdle);
    		if ('timeout' in $$props) timeout = $$props.timeout;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [onActivity, isIdle];
    }

    class IdleDetector extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { isIdle: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IdleDetector",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get isIdle() {
    		throw new Error("<IdleDetector>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isIdle(value) {
    		throw new Error("<IdleDetector>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-video-player/src/ScrollDetector.svelte generated by Svelte v3.48.0 */

    function create_fragment$7(ctx) {
    	let mounted;
    	let dispose;

    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (!mounted) {
    				dispose = listen_dev(window, "scroll", /*onScroll*/ ctx[0], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ScrollDetector', slots, []);
    	let { isScrolling = false } = $$props;
    	let timeout;

    	function onScroll(e) {
    		$$invalidate(1, isScrolling = true);
    		setScrollEndTimeout();
    	}

    	const setScrollEndTimeout = debounce(
    		() => {
    			clearTimeout(timeout);

    			timeout = setTimeout(
    				() => {
    					$$invalidate(1, isScrolling = false);
    				},
    				100
    			);
    		},
    		100,
    		true
    	);

    	onDestroy(() => {
    		clearTimeout(timeout);
    	});

    	const writable_props = ['isScrolling'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ScrollDetector> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('isScrolling' in $$props) $$invalidate(1, isScrolling = $$props.isScrolling);
    	};

    	$$self.$capture_state = () => ({
    		debounce,
    		onDestroy,
    		isScrolling,
    		timeout,
    		onScroll,
    		setScrollEndTimeout
    	});

    	$$self.$inject_state = $$props => {
    		if ('isScrolling' in $$props) $$invalidate(1, isScrolling = $$props.isScrolling);
    		if ('timeout' in $$props) timeout = $$props.timeout;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [onScroll, isScrolling];
    }

    class ScrollDetector extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { isScrolling: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ScrollDetector",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get isScrolling() {
    		throw new Error("<ScrollDetector>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isScrolling(value) {
    		throw new Error("<ScrollDetector>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-video-player/src/Time.svelte generated by Svelte v3.48.0 */
    const file$5 = "node_modules/svelte-video-player/src/Time.svelte";

    function create_fragment$6(ctx) {
    	let div1;
    	let div0;
    	let t;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t = text(/*ft*/ ctx[0]);
    			attr_dev(div0, "class", "text svelte-1a30cmt");
    			add_location(div0, file$5, 48, 2, 960);
    			attr_dev(div1, "class", "time svelte-1a30cmt");
    			add_location(div1, file$5, 47, 0, 938);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*ft*/ 1) set_data_dev(t, /*ft*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let hours;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Time', slots, []);
    	let { duration } = $$props;
    	let { currentTime } = $$props;
    	let ft = 0;

    	const setTime = throttle(
    		() => {
    			$$invalidate(0, ft = formatTime(currentTime, hours));
    		},
    		250,
    		true
    	);

    	const formatTime = (seconds = 0, hours = false) => {
    		let s = new Date(seconds * 1000).toISOString().substr(11, 8);
    		return hours ? s : s.substring(3);
    	};

    	const writable_props = ['duration', 'currentTime'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Time> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('duration' in $$props) $$invalidate(1, duration = $$props.duration);
    		if ('currentTime' in $$props) $$invalidate(2, currentTime = $$props.currentTime);
    	};

    	$$self.$capture_state = () => ({
    		throttle,
    		duration,
    		currentTime,
    		ft,
    		setTime,
    		formatTime,
    		hours
    	});

    	$$self.$inject_state = $$props => {
    		if ('duration' in $$props) $$invalidate(1, duration = $$props.duration);
    		if ('currentTime' in $$props) $$invalidate(2, currentTime = $$props.currentTime);
    		if ('ft' in $$props) $$invalidate(0, ft = $$props.ft);
    		if ('hours' in $$props) hours = $$props.hours;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*duration*/ 2) {
    			hours = duration >= 3600;
    		}

    		if ($$self.$$.dirty & /*currentTime*/ 4) {
    			{
    				if (currentTime) setTime();
    			}
    		}
    	};

    	return [ft, duration, currentTime];
    }

    class Time extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { duration: 1, currentTime: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Time",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*duration*/ ctx[1] === undefined && !('duration' in props)) {
    			console.warn("<Time> was created without expected prop 'duration'");
    		}

    		if (/*currentTime*/ ctx[2] === undefined && !('currentTime' in props)) {
    			console.warn("<Time> was created without expected prop 'currentTime'");
    		}
    	}

    	get duration() {
    		throw new Error("<Time>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<Time>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get currentTime() {
    		throw new Error("<Time>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentTime(value) {
    		throw new Error("<Time>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-video-player/src/VideoPlayerClient.svelte generated by Svelte v3.48.0 */
    const file$4 = "node_modules/svelte-video-player/src/VideoPlayerClient.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[84] = list[i].src;
    	child_ctx[85] = list[i].type;
    	return child_ctx;
    }

    // (346:2) {:catch error}
    function create_catch_block(ctx) {
    	let p;
    	let t_value = /*error*/ ctx[88] + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			set_style(p, "color", "red");
    			attr_dev(p, "class", "svelte-1ai3mbf");
    			add_location(p, file$4, 346, 4, 10864);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*poster*/ 4 && t_value !== (t_value = /*error*/ ctx[88] + "")) set_data_dev(t, t_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(346:2) {:catch error}",
    		ctx
    	});

    	return block;
    }

    // (282:2) {:then}
    function create_then_block(ctx) {
    	let div;
    	let video;
    	let track;
    	let p;
    	let video_updating = false;
    	let video_animationframe;
    	let video_is_paused = true;
    	let t1;
    	let t2;
    	let controls;
    	let div_tabindex_value;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*_sources*/ ctx[31];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	function video_timeupdate_handler() {
    		cancelAnimationFrame(video_animationframe);

    		if (!video.paused) {
    			video_animationframe = raf(video_timeupdate_handler);
    			video_updating = true;
    		}

    		/*video_timeupdate_handler*/ ctx[61].call(video);
    	}

    	let if_block = /*poster*/ ctx[2] && /*isPosterVisible*/ ctx[30] && create_if_block_2(ctx);

    	controls = new Controls({
    			props: {
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			video = element("video");
    			track = element("track");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			p = element("p");
    			p.textContent = "Sorry, your browser doesn't support HTML5 videos.";
    			t1 = space();
    			if (if_block) if_block.c();
    			t2 = space();
    			create_component(controls.$$.fragment);
    			attr_dev(track, "kind", "captions");
    			add_location(track, file$4, 306, 8, 9501);
    			add_location(p, file$4, 310, 8, 9631);
    			attr_dev(video, "width", /*width*/ ctx[0]);
    			attr_dev(video, "height", /*height*/ ctx[1]);
    			attr_dev(video, "preload", "none");
    			attr_dev(video, "class", "svelte-1ai3mbf");
    			if (/*currentTime*/ ctx[9] === void 0 || /*played*/ ctx[21] === void 0 || /*ended*/ ctx[11] === void 0) add_render_callback(video_timeupdate_handler);
    			if (/*duration*/ ctx[19] === void 0) add_render_callback(() => /*video_durationchange_handler*/ ctx[62].call(video));
    			if (/*buffered*/ ctx[20] === void 0) add_render_callback(() => /*video_progress_handler*/ ctx[63].call(video));
    			if (/*buffered*/ ctx[20] === void 0) add_render_callback(() => /*video_loadedmetadata_handler*/ ctx[64].call(video));
    			if (/*seeking*/ ctx[10] === void 0) add_render_callback(() => /*video_seeking_seeked_handler*/ ctx[65].call(video));
    			if (/*ended*/ ctx[11] === void 0) add_render_callback(() => /*video_ended_handler*/ ctx[66].call(video));
    			add_location(video, file$4, 289, 6, 9066);
    			attr_dev(div, "id", "video-player-" + uid());
    			attr_dev(div, "tabindex", div_tabindex_value = /*isVideoData*/ ctx[14] ? '0' : '-1');
    			attr_dev(div, "class", "svelte-1ai3mbf");
    			add_location(div, file$4, 282, 4, 8813);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, video);
    			append_dev(video, track);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(video, null);
    			}

    			append_dev(video, p);
    			/*video_binding*/ ctx[60](video);

    			if (!isNaN(/*volume*/ ctx[13])) {
    				video.volume = /*volume*/ ctx[13];
    			}

    			append_dev(div, t1);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t2);
    			mount_component(controls, div, null);
    			/*div_binding*/ ctx[74](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(video, "timeupdate", video_timeupdate_handler),
    					listen_dev(video, "durationchange", /*video_durationchange_handler*/ ctx[62]),
    					listen_dev(video, "progress", /*video_progress_handler*/ ctx[63]),
    					listen_dev(video, "loadedmetadata", /*video_loadedmetadata_handler*/ ctx[64]),
    					listen_dev(video, "seeking", /*video_seeking_seeked_handler*/ ctx[65]),
    					listen_dev(video, "seeked", /*video_seeking_seeked_handler*/ ctx[65]),
    					listen_dev(video, "ended", /*video_ended_handler*/ ctx[66]),
    					listen_dev(video, "play", /*video_play_pause_handler*/ ctx[67]),
    					listen_dev(video, "pause", /*video_play_pause_handler*/ ctx[67]),
    					listen_dev(video, "volumechange", /*video_volumechange_handler*/ ctx[68]),
    					listen_dev(video, "loadeddata", /*onVideoLoadedData*/ ctx[33], { once: true }, false, false),
    					listen_dev(video, "play", onPlay, false, false, false),
    					listen_dev(video, "playing", /*onVideoPlaying*/ ctx[34], false, false, false),
    					listen_dev(video, "waiting", /*onVideoWaiting*/ ctx[35], false, false, false),
    					listen_dev(div, "pointerover", /*onPlayerPointerOver*/ ctx[36], false, false, false),
    					listen_dev(div, "pointerout", /*onPlayerPointerOut*/ ctx[37], false, false, false),
    					listen_dev(div, "pointerup", /*onPlayerPointerUp*/ ctx[38], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[1] & /*_sources*/ 1) {
    				each_value = /*_sources*/ ctx[31];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(video, p);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (!current || dirty[0] & /*width*/ 1) {
    				attr_dev(video, "width", /*width*/ ctx[0]);
    			}

    			if (!current || dirty[0] & /*height*/ 2) {
    				attr_dev(video, "height", /*height*/ ctx[1]);
    			}

    			if (!video_updating && dirty[0] & /*currentTime*/ 512 && !isNaN(/*currentTime*/ ctx[9])) {
    				video.currentTime = /*currentTime*/ ctx[9];
    			}

    			video_updating = false;

    			if (dirty[0] & /*paused*/ 4096 && video_is_paused !== (video_is_paused = /*paused*/ ctx[12])) {
    				video[video_is_paused ? "pause" : "play"]();
    			}

    			if (dirty[0] & /*volume*/ 8192 && !isNaN(/*volume*/ ctx[13])) {
    				video.volume = /*volume*/ ctx[13];
    			}

    			if (/*poster*/ ctx[2] && /*isPosterVisible*/ ctx[30]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*poster, isPosterVisible*/ 1073741828) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, t2);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			const controls_changes = {};

    			if (dirty[0] & /*isCenterIconVisibile, isSpinnerVisible, isBuffering, isBottomControlsVisible, isPointerOverControls, isFullscreen, isFullscreenEnabled, volume, muted, duration, currentTime, timeDisplay, buffered, played, paused, isScrubbing*/ 1039839872 | dirty[2] & /*$$scope*/ 134217728) {
    				controls_changes.$$scope = { dirty, ctx };
    			}

    			controls.$set(controls_changes);

    			if (!current || dirty[0] & /*isVideoData*/ 16384 && div_tabindex_value !== (div_tabindex_value = /*isVideoData*/ ctx[14] ? '0' : '-1')) {
    				attr_dev(div, "tabindex", div_tabindex_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(controls.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(controls.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			/*video_binding*/ ctx[60](null);
    			if (if_block) if_block.d();
    			destroy_component(controls);
    			/*div_binding*/ ctx[74](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(282:2) {:then}",
    		ctx
    	});

    	return block;
    }

    // (308:8) {#each _sources as { src, type }}
    function create_each_block$1(ctx) {
    	let source_1;
    	let source_1_src_value;
    	let source_1_type_value;

    	const block = {
    		c: function create() {
    			source_1 = element("source");
    			if (!src_url_equal(source_1.src, source_1_src_value = /*src*/ ctx[84])) attr_dev(source_1, "src", source_1_src_value);
    			attr_dev(source_1, "type", source_1_type_value = /*type*/ ctx[85]);
    			add_location(source_1, file$4, 308, 10, 9581);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, source_1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[1] & /*_sources*/ 1 && !src_url_equal(source_1.src, source_1_src_value = /*src*/ ctx[84])) {
    				attr_dev(source_1, "src", source_1_src_value);
    			}

    			if (dirty[1] & /*_sources*/ 1 && source_1_type_value !== (source_1_type_value = /*type*/ ctx[85])) {
    				attr_dev(source_1, "type", source_1_type_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(source_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(308:8) {#each _sources as { src, type }}",
    		ctx
    	});

    	return block;
    }

    // (314:6) {#if poster && isPosterVisible}
    function create_if_block_2(ctx) {
    	let poster_1;
    	let current;

    	poster_1 = new Poster({
    			props: { src: /*poster*/ ctx[2] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(poster_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(poster_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const poster_1_changes = {};
    			if (dirty[0] & /*poster*/ 4) poster_1_changes.src = /*poster*/ ctx[2];
    			poster_1.$set(poster_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(poster_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(poster_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(poster_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(314:6) {#if poster && isPosterVisible}",
    		ctx
    	});

    	return block;
    }

    // (330:10) {#if timeDisplay}
    function create_if_block_1(ctx) {
    	let time;
    	let current;

    	time = new Time({
    			props: {
    				duration: /*duration*/ ctx[19],
    				currentTime: /*currentTime*/ ctx[9]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(time.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(time, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const time_changes = {};
    			if (dirty[0] & /*duration*/ 524288) time_changes.duration = /*duration*/ ctx[19];
    			if (dirty[0] & /*currentTime*/ 512) time_changes.currentTime = /*currentTime*/ ctx[9];
    			time.$set(time_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(time.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(time.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(time, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(330:10) {#if timeDisplay}",
    		ctx
    	});

    	return block;
    }

    // (335:10) {#if isFullscreenEnabled}
    function create_if_block$1(ctx) {
    	let fullscreenbutton;
    	let current;

    	fullscreenbutton = new FullscreenButton({
    			props: { isFullscreen: /*isFullscreen*/ ctx[24] },
    			$$inline: true
    		});

    	fullscreenbutton.$on("pointerup", /*onFullscreenButtonPointerUp*/ ctx[41]);

    	const block = {
    		c: function create() {
    			create_component(fullscreenbutton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fullscreenbutton, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const fullscreenbutton_changes = {};
    			if (dirty[0] & /*isFullscreen*/ 16777216) fullscreenbutton_changes.isFullscreen = /*isFullscreen*/ ctx[24];
    			fullscreenbutton.$set(fullscreenbutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fullscreenbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fullscreenbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fullscreenbutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(335:10) {#if isFullscreenEnabled}",
    		ctx
    	});

    	return block;
    }

    // (319:8) <BottomControls hidden={!isBottomControlsVisible} bind:isPointerOver={isPointerOverControls}>
    function create_default_slot_1$1(ctx) {
    	let playpausebutton;
    	let t0;
    	let playbar;
    	let updating_currentTime;
    	let updating_paused;
    	let updating_isScrubbing;
    	let t1;
    	let t2;
    	let volumebutton;
    	let t3;
    	let volumecontrol;
    	let updating_volume;
    	let t4;
    	let if_block1_anchor;
    	let current;

    	playpausebutton = new PlayPauseButton({
    			props: { paused: /*paused*/ ctx[12] },
    			$$inline: true
    		});

    	playpausebutton.$on("pointerup", /*onPlayPauseButtonPointerUp*/ ctx[43]);

    	function playbar_currentTime_binding(value) {
    		/*playbar_currentTime_binding*/ ctx[69](value);
    	}

    	function playbar_paused_binding(value) {
    		/*playbar_paused_binding*/ ctx[70](value);
    	}

    	function playbar_isScrubbing_binding(value) {
    		/*playbar_isScrubbing_binding*/ ctx[71](value);
    	}

    	let playbar_props = {
    		duration: /*duration*/ ctx[19],
    		buffered: /*buffered*/ ctx[20],
    		played: /*played*/ ctx[21],
    		isBottomControlsVisible: /*isBottomControlsVisible*/ ctx[27]
    	};

    	if (/*currentTime*/ ctx[9] !== void 0) {
    		playbar_props.currentTime = /*currentTime*/ ctx[9];
    	}

    	if (/*paused*/ ctx[12] !== void 0) {
    		playbar_props.paused = /*paused*/ ctx[12];
    	}

    	if (/*isScrubbing*/ ctx[17] !== void 0) {
    		playbar_props.isScrubbing = /*isScrubbing*/ ctx[17];
    	}

    	playbar = new Playbar({ props: playbar_props, $$inline: true });
    	binding_callbacks.push(() => bind(playbar, 'currentTime', playbar_currentTime_binding));
    	binding_callbacks.push(() => bind(playbar, 'paused', playbar_paused_binding));
    	binding_callbacks.push(() => bind(playbar, 'isScrubbing', playbar_isScrubbing_binding));
    	playbar.$on("pointerup", /*onPlaybarPointerUp*/ ctx[42]);
    	let if_block0 = /*timeDisplay*/ ctx[7] && create_if_block_1(ctx);

    	volumebutton = new VolumeButton({
    			props: { muted: /*muted*/ ctx[26] },
    			$$inline: true
    		});

    	volumebutton.$on("pointerup", /*onVolumeButtonPointerUp*/ ctx[44]);

    	function volumecontrol_volume_binding(value) {
    		/*volumecontrol_volume_binding*/ ctx[72](value);
    	}

    	let volumecontrol_props = {};

    	if (/*volume*/ ctx[13] !== void 0) {
    		volumecontrol_props.volume = /*volume*/ ctx[13];
    	}

    	volumecontrol = new VolumeControl({
    			props: volumecontrol_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(volumecontrol, 'volume', volumecontrol_volume_binding));
    	let if_block1 = /*isFullscreenEnabled*/ ctx[23] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			create_component(playpausebutton.$$.fragment);
    			t0 = space();
    			create_component(playbar.$$.fragment);
    			t1 = space();
    			if (if_block0) if_block0.c();
    			t2 = space();
    			create_component(volumebutton.$$.fragment);
    			t3 = space();
    			create_component(volumecontrol.$$.fragment);
    			t4 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			mount_component(playpausebutton, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(playbar, target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(volumebutton, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(volumecontrol, target, anchor);
    			insert_dev(target, t4, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const playpausebutton_changes = {};
    			if (dirty[0] & /*paused*/ 4096) playpausebutton_changes.paused = /*paused*/ ctx[12];
    			playpausebutton.$set(playpausebutton_changes);
    			const playbar_changes = {};
    			if (dirty[0] & /*duration*/ 524288) playbar_changes.duration = /*duration*/ ctx[19];
    			if (dirty[0] & /*buffered*/ 1048576) playbar_changes.buffered = /*buffered*/ ctx[20];
    			if (dirty[0] & /*played*/ 2097152) playbar_changes.played = /*played*/ ctx[21];
    			if (dirty[0] & /*isBottomControlsVisible*/ 134217728) playbar_changes.isBottomControlsVisible = /*isBottomControlsVisible*/ ctx[27];

    			if (!updating_currentTime && dirty[0] & /*currentTime*/ 512) {
    				updating_currentTime = true;
    				playbar_changes.currentTime = /*currentTime*/ ctx[9];
    				add_flush_callback(() => updating_currentTime = false);
    			}

    			if (!updating_paused && dirty[0] & /*paused*/ 4096) {
    				updating_paused = true;
    				playbar_changes.paused = /*paused*/ ctx[12];
    				add_flush_callback(() => updating_paused = false);
    			}

    			if (!updating_isScrubbing && dirty[0] & /*isScrubbing*/ 131072) {
    				updating_isScrubbing = true;
    				playbar_changes.isScrubbing = /*isScrubbing*/ ctx[17];
    				add_flush_callback(() => updating_isScrubbing = false);
    			}

    			playbar.$set(playbar_changes);

    			if (/*timeDisplay*/ ctx[7]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*timeDisplay*/ 128) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t2.parentNode, t2);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			const volumebutton_changes = {};
    			if (dirty[0] & /*muted*/ 67108864) volumebutton_changes.muted = /*muted*/ ctx[26];
    			volumebutton.$set(volumebutton_changes);
    			const volumecontrol_changes = {};

    			if (!updating_volume && dirty[0] & /*volume*/ 8192) {
    				updating_volume = true;
    				volumecontrol_changes.volume = /*volume*/ ctx[13];
    				add_flush_callback(() => updating_volume = false);
    			}

    			volumecontrol.$set(volumecontrol_changes);

    			if (/*isFullscreenEnabled*/ ctx[23]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*isFullscreenEnabled*/ 8388608) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(playpausebutton.$$.fragment, local);
    			transition_in(playbar.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(volumebutton.$$.fragment, local);
    			transition_in(volumecontrol.$$.fragment, local);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(playpausebutton.$$.fragment, local);
    			transition_out(playbar.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(volumebutton.$$.fragment, local);
    			transition_out(volumecontrol.$$.fragment, local);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(playpausebutton, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(playbar, detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(volumebutton, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(volumecontrol, detaching);
    			if (detaching) detach_dev(t4);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(319:8) <BottomControls hidden={!isBottomControlsVisible} bind:isPointerOver={isPointerOverControls}>",
    		ctx
    	});

    	return block;
    }

    // (318:6) <Controls>
    function create_default_slot$1(ctx) {
    	let bottomcontrols;
    	let updating_isPointerOver;
    	let t;
    	let centericons;
    	let current;

    	function bottomcontrols_isPointerOver_binding(value) {
    		/*bottomcontrols_isPointerOver_binding*/ ctx[73](value);
    	}

    	let bottomcontrols_props = {
    		hidden: !/*isBottomControlsVisible*/ ctx[27],
    		$$slots: { default: [create_default_slot_1$1] },
    		$$scope: { ctx }
    	};

    	if (/*isPointerOverControls*/ ctx[22] !== void 0) {
    		bottomcontrols_props.isPointerOver = /*isPointerOverControls*/ ctx[22];
    	}

    	bottomcontrols = new BottomControls({
    			props: bottomcontrols_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(bottomcontrols, 'isPointerOver', bottomcontrols_isPointerOver_binding));

    	centericons = new CenterIcons({
    			props: {
    				isIconVisible: /*isCenterIconVisibile*/ ctx[28],
    				isSpinnerVisible: /*isSpinnerVisible*/ ctx[29],
    				isBuffering: /*isBuffering*/ ctx[15]
    			},
    			$$inline: true
    		});

    	centericons.$on("togglePause", /*togglePause*/ ctx[45]);

    	const block = {
    		c: function create() {
    			create_component(bottomcontrols.$$.fragment);
    			t = space();
    			create_component(centericons.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(bottomcontrols, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(centericons, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const bottomcontrols_changes = {};
    			if (dirty[0] & /*isBottomControlsVisible*/ 134217728) bottomcontrols_changes.hidden = !/*isBottomControlsVisible*/ ctx[27];

    			if (dirty[0] & /*isFullscreen, isFullscreenEnabled, volume, muted, duration, currentTime, timeDisplay, buffered, played, isBottomControlsVisible, paused, isScrubbing*/ 230306432 | dirty[2] & /*$$scope*/ 134217728) {
    				bottomcontrols_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_isPointerOver && dirty[0] & /*isPointerOverControls*/ 4194304) {
    				updating_isPointerOver = true;
    				bottomcontrols_changes.isPointerOver = /*isPointerOverControls*/ ctx[22];
    				add_flush_callback(() => updating_isPointerOver = false);
    			}

    			bottomcontrols.$set(bottomcontrols_changes);
    			const centericons_changes = {};
    			if (dirty[0] & /*isCenterIconVisibile*/ 268435456) centericons_changes.isIconVisible = /*isCenterIconVisibile*/ ctx[28];
    			if (dirty[0] & /*isSpinnerVisible*/ 536870912) centericons_changes.isSpinnerVisible = /*isSpinnerVisible*/ ctx[29];
    			if (dirty[0] & /*isBuffering*/ 32768) centericons_changes.isBuffering = /*isBuffering*/ ctx[15];
    			centericons.$set(centericons_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(bottomcontrols.$$.fragment, local);
    			transition_in(centericons.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(bottomcontrols.$$.fragment, local);
    			transition_out(centericons.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(bottomcontrols, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(centericons, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(318:6) <Controls>",
    		ctx
    	});

    	return block;
    }

    // (278:31)       <div>        <Spinner color={iconColor}
    function create_pending_block(ctx) {
    	let div;
    	let spinner;
    	let current;

    	spinner = new Spinner({
    			props: {
    				color: /*iconColor*/ ctx[4],
    				size: "60px"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(spinner.$$.fragment);
    			attr_dev(div, "class", "svelte-1ai3mbf");
    			add_location(div, file$4, 278, 4, 8730);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(spinner, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const spinner_changes = {};
    			if (dirty[0] & /*iconColor*/ 16) spinner_changes.color = /*iconColor*/ ctx[4];
    			spinner.$set(spinner_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(spinner.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(spinner.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(spinner);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(278:31)       <div>        <Spinner color={iconColor}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let promise;
    	let t0;
    	let idledetector;
    	let updating_isIdle;
    	let t1;
    	let scrolldetector;
    	let updating_isScrolling;
    	let t2;
    	let fullscreenmanager;
    	let updating_isFullscreenEnabled;
    	let updating_isFullscreen;
    	let current;
    	let mounted;
    	let dispose;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: true,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		error: 88,
    		blocks: [,,,]
    	};

    	handle_promise(promise = preloadImage(/*poster*/ ctx[2]), info);

    	function idledetector_isIdle_binding(value) {
    		/*idledetector_isIdle_binding*/ ctx[75](value);
    	}

    	let idledetector_props = {};

    	if (/*isIdle*/ ctx[16] !== void 0) {
    		idledetector_props.isIdle = /*isIdle*/ ctx[16];
    	}

    	idledetector = new IdleDetector({
    			props: idledetector_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(idledetector, 'isIdle', idledetector_isIdle_binding));

    	function scrolldetector_isScrolling_binding(value) {
    		/*scrolldetector_isScrolling_binding*/ ctx[76](value);
    	}

    	let scrolldetector_props = {};

    	if (/*isScrolling*/ ctx[25] !== void 0) {
    		scrolldetector_props.isScrolling = /*isScrolling*/ ctx[25];
    	}

    	scrolldetector = new ScrollDetector({
    			props: scrolldetector_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(scrolldetector, 'isScrolling', scrolldetector_isScrolling_binding));

    	function fullscreenmanager_isFullscreenEnabled_binding(value) {
    		/*fullscreenmanager_isFullscreenEnabled_binding*/ ctx[77](value);
    	}

    	function fullscreenmanager_isFullscreen_binding(value) {
    		/*fullscreenmanager_isFullscreen_binding*/ ctx[78](value);
    	}

    	let fullscreenmanager_props = { element: /*videoPlayerElement*/ ctx[18] };

    	if (/*isFullscreenEnabled*/ ctx[23] !== void 0) {
    		fullscreenmanager_props.isFullscreenEnabled = /*isFullscreenEnabled*/ ctx[23];
    	}

    	if (/*isFullscreen*/ ctx[24] !== void 0) {
    		fullscreenmanager_props.isFullscreen = /*isFullscreen*/ ctx[24];
    	}

    	fullscreenmanager = new FullscreenManager({
    			props: fullscreenmanager_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fullscreenmanager, 'isFullscreenEnabled', fullscreenmanager_isFullscreenEnabled_binding));
    	binding_callbacks.push(() => bind(fullscreenmanager, 'isFullscreen', fullscreenmanager_isFullscreen_binding));

    	const block = {
    		c: function create() {
    			div = element("div");
    			info.block.c();
    			t0 = space();
    			create_component(idledetector.$$.fragment);
    			t1 = space();
    			create_component(scrolldetector.$$.fragment);
    			t2 = space();
    			create_component(fullscreenmanager.$$.fragment);
    			attr_dev(div, "class", "aspect svelte-1ai3mbf");
    			set_style(div, "padding-top", /*aspectRatio*/ ctx[6] * 100 + "%");
    			set_style(div, "background-color", /*playerBgColor*/ ctx[3]);
    			set_style(div, "border-radius", /*borderRadius*/ ctx[5]);
    			add_location(div, file$4, 274, 0, 8560);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			info.block.m(div, info.anchor = null);
    			info.mount = () => div;
    			info.anchor = t0;
    			append_dev(div, t0);
    			mount_component(idledetector, div, null);
    			append_dev(div, t1);
    			mount_component(scrolldetector, div, null);
    			append_dev(div, t2);
    			mount_component(fullscreenmanager, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "keydown", /*onWindowKeyDown*/ ctx[39], false, false, false),
    					listen_dev(window, "keyup", /*onWindowKeyUp*/ ctx[40], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty[0] & /*poster*/ 4 && promise !== (promise = preloadImage(/*poster*/ ctx[2])) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}

    			const idledetector_changes = {};

    			if (!updating_isIdle && dirty[0] & /*isIdle*/ 65536) {
    				updating_isIdle = true;
    				idledetector_changes.isIdle = /*isIdle*/ ctx[16];
    				add_flush_callback(() => updating_isIdle = false);
    			}

    			idledetector.$set(idledetector_changes);
    			const scrolldetector_changes = {};

    			if (!updating_isScrolling && dirty[0] & /*isScrolling*/ 33554432) {
    				updating_isScrolling = true;
    				scrolldetector_changes.isScrolling = /*isScrolling*/ ctx[25];
    				add_flush_callback(() => updating_isScrolling = false);
    			}

    			scrolldetector.$set(scrolldetector_changes);
    			const fullscreenmanager_changes = {};
    			if (dirty[0] & /*videoPlayerElement*/ 262144) fullscreenmanager_changes.element = /*videoPlayerElement*/ ctx[18];

    			if (!updating_isFullscreenEnabled && dirty[0] & /*isFullscreenEnabled*/ 8388608) {
    				updating_isFullscreenEnabled = true;
    				fullscreenmanager_changes.isFullscreenEnabled = /*isFullscreenEnabled*/ ctx[23];
    				add_flush_callback(() => updating_isFullscreenEnabled = false);
    			}

    			if (!updating_isFullscreen && dirty[0] & /*isFullscreen*/ 16777216) {
    				updating_isFullscreen = true;
    				fullscreenmanager_changes.isFullscreen = /*isFullscreen*/ ctx[24];
    				add_flush_callback(() => updating_isFullscreen = false);
    			}

    			fullscreenmanager.$set(fullscreenmanager_changes);

    			if (!current || dirty[0] & /*aspectRatio*/ 64) {
    				set_style(div, "padding-top", /*aspectRatio*/ ctx[6] * 100 + "%");
    			}

    			if (!current || dirty[0] & /*playerBgColor*/ 8) {
    				set_style(div, "background-color", /*playerBgColor*/ ctx[3]);
    			}

    			if (!current || dirty[0] & /*borderRadius*/ 32) {
    				set_style(div, "border-radius", /*borderRadius*/ ctx[5]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			transition_in(idledetector.$$.fragment, local);
    			transition_in(scrolldetector.$$.fragment, local);
    			transition_in(fullscreenmanager.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			transition_out(idledetector.$$.fragment, local);
    			transition_out(scrolldetector.$$.fragment, local);
    			transition_out(fullscreenmanager.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			info.block.d();
    			info.token = null;
    			info = null;
    			destroy_component(idledetector);
    			destroy_component(scrolldetector);
    			destroy_component(fullscreenmanager);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    let currentVideo;

    function onPlay(e) {
    	if (currentVideo && currentVideo !== e.target) currentVideo.pause(); // Pause other videos
    	currentVideo = e.target;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let _sources;
    	let _skipSeconds;
    	let muted;
    	let isPosterVisible;
    	let isBottomControlsVisible;
    	let isSpinnerVisible;
    	let isCenterIconVisibile;
    	let $config;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('VideoPlayerClient', slots, []);
    	let { width } = $$props;
    	let { height } = $$props;
    	let { poster } = $$props;
    	let { source } = $$props;
    	let { controlsHeight } = $$props;
    	let { trackHeight } = $$props;
    	let { thumbSize } = $$props;
    	let { centerIconSize } = $$props;
    	let { playerBgColor } = $$props;
    	let { color } = $$props;
    	let { focusColor } = $$props;
    	let { barsBgColor } = $$props;
    	let { iconColor } = $$props;
    	let { bufferedColor } = $$props;
    	let { chunkBars } = $$props;
    	let { borderRadius } = $$props;
    	let { loop } = $$props;
    	let { skipSeconds } = $$props;
    	let { aspectRatio } = $$props;
    	let { controlsOnPause } = $$props;
    	let { timeDisplay } = $$props;

    	//-------------------------------------------------------------------------------------------------------------------
    	// REACTIVE CONFIG CONTEXT
    	//-------------------------------------------------------------------------------------------------------------------
    	const config = writable({});

    	validate_store(config, 'config');
    	component_subscribe($$self, config, value => $$invalidate(82, $config = value));
    	setContext('config', config);

    	//-------------------------------------------------------------------------------------------------------------------
    	// VIDEO ELEMENT BINDINGS
    	//-------------------------------------------------------------------------------------------------------------------
    	let videoPlayerElement;

    	let videoElement;
    	let currentTime = 0;
    	let duration;
    	let buffered = []; // [{start, end}]
    	let played = []; // [{start, end}]
    	let seeking;
    	let ended;
    	let paused = true;
    	let volume = 1;
    	let muteVolume = 1;

    	//-------------------------------------------------------------------------------------------------------------------
    	// APP STATE FLAGS
    	//-------------------------------------------------------------------------------------------------------------------
    	let isVideoData = false;

    	let isPointerOverVideo = false;
    	let isPointerOverControls = false;
    	let isBuffering = false;
    	let isFullscreenEnabled = false;
    	let isFullscreen = false;
    	let isIdle = false;
    	let isScrolling = false;
    	let isScrubbing = false;
    	let isKeyDown = false;

    	//-------------------------------------------------------------------------------------------------------------------
    	// EVENT HANDLERS
    	//-------------------------------------------------------------------------------------------------------------------
    	function onVideoLoadedData(e) {
    		$$invalidate(14, isVideoData = true);
    	}

    	function onVideoPlaying(e) {
    		$$invalidate(15, isBuffering = false);
    	}

    	function onVideoWaiting(e) {
    		$$invalidate(15, isBuffering = true);
    	}

    	//-------------------------------------------------------------------------------------------------------------------
    	function onPlayerPointerOver(e) {
    		$$invalidate(59, isPointerOverVideo = true);
    	}

    	function onPlayerPointerOut(e) {
    		$$invalidate(59, isPointerOverVideo = false);
    	}

    	function onPlayerPointerUp(e) {
    		if (!isPointerOverControls && !isScrolling) {
    			$$invalidate(12, paused = !paused);
    		}
    	}

    	//-------------------------------------------------------------------------------------------------------------------
    	function onWindowKeyDown(e) {
    		if (currentVideo !== videoElement) return;

    		switch (e.code) {
    			case 'Tab':
    				if (isKeyDown) break;
    				if (!isBottomControlsVisible) {
    					e.stopPropagation(); // Prevent long press
    					e.preventDefault();
    					$$invalidate(27, isBottomControlsVisible = true);
    				}
    				break;
    			case 'Space':
    				if (isKeyDown) break;
    				e.preventDefault();
    				currentVideo.paused
    				? currentVideo.play()
    				: currentVideo.pause();
    				break;
    			case 'ArrowLeft':
    				e.preventDefault();
    				timeJump(true);
    				break;
    			case 'ArrowRight':
    				e.preventDefault();
    				timeJump();
    				break;
    		} // Prevent long press
    		// Prevent page scroll

    		isKeyDown = true;
    	}

    	function onWindowKeyUp(e) {
    		if (currentVideo !== videoElement) return;
    		isKeyDown = false;
    	}

    	function timeJump(back) {
    		const t = videoElement.currentTime;
    		const d = videoElement.duration;
    		if (back) $$invalidate(8, videoElement.currentTime = t > _skipSeconds ? t - _skipSeconds : 0, videoElement); else $$invalidate(8, videoElement.currentTime = t + _skipSeconds < d ? t + _skipSeconds : d - 0.2, videoElement);
    	}

    	//-------------------------------------------------------------------------------------------------------------------
    	function onFullscreenButtonPointerUp(e) {
    		$$invalidate(24, isFullscreen = !isFullscreen);
    	}

    	function onPlaybarPointerUp(e) {
    		if (videoElement != videoElement) $$invalidate(12, paused = false);
    	}

    	function onPlayPauseButtonPointerUp(e) {
    		$$invalidate(12, paused = !paused);
    	}

    	function onVolumeButtonPointerUp(e) {
    		if (!muted) {
    			muteVolume = volume;
    			$$invalidate(13, volume = 0);
    		} else {
    			$$invalidate(13, volume = muteVolume);
    			muteVolume = 1;
    		}
    	}

    	function togglePause() {
    		$$invalidate(12, paused = !paused);
    	}

    	const writable_props = [
    		'width',
    		'height',
    		'poster',
    		'source',
    		'controlsHeight',
    		'trackHeight',
    		'thumbSize',
    		'centerIconSize',
    		'playerBgColor',
    		'color',
    		'focusColor',
    		'barsBgColor',
    		'iconColor',
    		'bufferedColor',
    		'chunkBars',
    		'borderRadius',
    		'loop',
    		'skipSeconds',
    		'aspectRatio',
    		'controlsOnPause',
    		'timeDisplay'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<VideoPlayerClient> was created with unknown prop '${key}'`);
    	});

    	function video_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			videoElement = $$value;
    			$$invalidate(8, videoElement);
    		});
    	}

    	function video_timeupdate_handler() {
    		currentTime = this.currentTime;
    		played = time_ranges_to_array(this.played);
    		ended = this.ended;
    		((($$invalidate(9, currentTime), $$invalidate(11, ended)), $$invalidate(56, loop)), $$invalidate(8, videoElement));
    		$$invalidate(21, played);
    		$$invalidate(11, ended);
    	}

    	function video_durationchange_handler() {
    		duration = this.duration;
    		$$invalidate(19, duration);
    	}

    	function video_progress_handler() {
    		buffered = time_ranges_to_array(this.buffered);
    		$$invalidate(20, buffered);
    	}

    	function video_loadedmetadata_handler() {
    		buffered = time_ranges_to_array(this.buffered);
    		$$invalidate(20, buffered);
    	}

    	function video_seeking_seeked_handler() {
    		seeking = this.seeking;
    		$$invalidate(10, seeking);
    	}

    	function video_ended_handler() {
    		ended = this.ended;
    		$$invalidate(11, ended);
    	}

    	function video_play_pause_handler() {
    		paused = this.paused;
    		$$invalidate(12, paused);
    	}

    	function video_volumechange_handler() {
    		volume = this.volume;
    		$$invalidate(13, volume);
    	}

    	function playbar_currentTime_binding(value) {
    		currentTime = value;
    		((($$invalidate(9, currentTime), $$invalidate(11, ended)), $$invalidate(56, loop)), $$invalidate(8, videoElement));
    	}

    	function playbar_paused_binding(value) {
    		paused = value;
    		$$invalidate(12, paused);
    	}

    	function playbar_isScrubbing_binding(value) {
    		isScrubbing = value;
    		$$invalidate(17, isScrubbing);
    	}

    	function volumecontrol_volume_binding(value) {
    		volume = value;
    		$$invalidate(13, volume);
    	}

    	function bottomcontrols_isPointerOver_binding(value) {
    		isPointerOverControls = value;
    		$$invalidate(22, isPointerOverControls);
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			videoPlayerElement = $$value;
    			$$invalidate(18, videoPlayerElement);
    		});
    	}

    	function idledetector_isIdle_binding(value) {
    		isIdle = value;
    		$$invalidate(16, isIdle);
    	}

    	function scrolldetector_isScrolling_binding(value) {
    		isScrolling = value;
    		$$invalidate(25, isScrolling);
    	}

    	function fullscreenmanager_isFullscreenEnabled_binding(value) {
    		isFullscreenEnabled = value;
    		$$invalidate(23, isFullscreenEnabled);
    	}

    	function fullscreenmanager_isFullscreen_binding(value) {
    		isFullscreen = value;
    		$$invalidate(24, isFullscreen);
    	}

    	$$self.$$set = $$props => {
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('poster' in $$props) $$invalidate(2, poster = $$props.poster);
    		if ('source' in $$props) $$invalidate(46, source = $$props.source);
    		if ('controlsHeight' in $$props) $$invalidate(47, controlsHeight = $$props.controlsHeight);
    		if ('trackHeight' in $$props) $$invalidate(48, trackHeight = $$props.trackHeight);
    		if ('thumbSize' in $$props) $$invalidate(49, thumbSize = $$props.thumbSize);
    		if ('centerIconSize' in $$props) $$invalidate(50, centerIconSize = $$props.centerIconSize);
    		if ('playerBgColor' in $$props) $$invalidate(3, playerBgColor = $$props.playerBgColor);
    		if ('color' in $$props) $$invalidate(51, color = $$props.color);
    		if ('focusColor' in $$props) $$invalidate(52, focusColor = $$props.focusColor);
    		if ('barsBgColor' in $$props) $$invalidate(53, barsBgColor = $$props.barsBgColor);
    		if ('iconColor' in $$props) $$invalidate(4, iconColor = $$props.iconColor);
    		if ('bufferedColor' in $$props) $$invalidate(54, bufferedColor = $$props.bufferedColor);
    		if ('chunkBars' in $$props) $$invalidate(55, chunkBars = $$props.chunkBars);
    		if ('borderRadius' in $$props) $$invalidate(5, borderRadius = $$props.borderRadius);
    		if ('loop' in $$props) $$invalidate(56, loop = $$props.loop);
    		if ('skipSeconds' in $$props) $$invalidate(57, skipSeconds = $$props.skipSeconds);
    		if ('aspectRatio' in $$props) $$invalidate(6, aspectRatio = $$props.aspectRatio);
    		if ('controlsOnPause' in $$props) $$invalidate(58, controlsOnPause = $$props.controlsOnPause);
    		if ('timeDisplay' in $$props) $$invalidate(7, timeDisplay = $$props.timeDisplay);
    	};

    	$$self.$capture_state = () => ({
    		currentVideo,
    		onPlay,
    		setContext,
    		writable,
    		uid,
    		preloadImage,
    		prepareVideoSources,
    		Poster,
    		Controls,
    		CenterIcons,
    		BottomControls,
    		Playbar,
    		PlayPauseButton,
    		VolumeButton,
    		VolumeControl,
    		FullscreenButton,
    		FullscreenManager,
    		IdleDetector,
    		ScrollDetector,
    		Spinner,
    		Time,
    		width,
    		height,
    		poster,
    		source,
    		controlsHeight,
    		trackHeight,
    		thumbSize,
    		centerIconSize,
    		playerBgColor,
    		color,
    		focusColor,
    		barsBgColor,
    		iconColor,
    		bufferedColor,
    		chunkBars,
    		borderRadius,
    		loop,
    		skipSeconds,
    		aspectRatio,
    		controlsOnPause,
    		timeDisplay,
    		config,
    		videoPlayerElement,
    		videoElement,
    		currentTime,
    		duration,
    		buffered,
    		played,
    		seeking,
    		ended,
    		paused,
    		volume,
    		muteVolume,
    		isVideoData,
    		isPointerOverVideo,
    		isPointerOverControls,
    		isBuffering,
    		isFullscreenEnabled,
    		isFullscreen,
    		isIdle,
    		isScrolling,
    		isScrubbing,
    		isKeyDown,
    		onVideoLoadedData,
    		onVideoPlaying,
    		onVideoWaiting,
    		onPlayerPointerOver,
    		onPlayerPointerOut,
    		onPlayerPointerUp,
    		onWindowKeyDown,
    		onWindowKeyUp,
    		timeJump,
    		onFullscreenButtonPointerUp,
    		onPlaybarPointerUp,
    		onPlayPauseButtonPointerUp,
    		onVolumeButtonPointerUp,
    		togglePause,
    		muted,
    		_skipSeconds,
    		isBottomControlsVisible,
    		isCenterIconVisibile,
    		isSpinnerVisible,
    		isPosterVisible,
    		_sources,
    		$config
    	});

    	$$self.$inject_state = $$props => {
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('poster' in $$props) $$invalidate(2, poster = $$props.poster);
    		if ('source' in $$props) $$invalidate(46, source = $$props.source);
    		if ('controlsHeight' in $$props) $$invalidate(47, controlsHeight = $$props.controlsHeight);
    		if ('trackHeight' in $$props) $$invalidate(48, trackHeight = $$props.trackHeight);
    		if ('thumbSize' in $$props) $$invalidate(49, thumbSize = $$props.thumbSize);
    		if ('centerIconSize' in $$props) $$invalidate(50, centerIconSize = $$props.centerIconSize);
    		if ('playerBgColor' in $$props) $$invalidate(3, playerBgColor = $$props.playerBgColor);
    		if ('color' in $$props) $$invalidate(51, color = $$props.color);
    		if ('focusColor' in $$props) $$invalidate(52, focusColor = $$props.focusColor);
    		if ('barsBgColor' in $$props) $$invalidate(53, barsBgColor = $$props.barsBgColor);
    		if ('iconColor' in $$props) $$invalidate(4, iconColor = $$props.iconColor);
    		if ('bufferedColor' in $$props) $$invalidate(54, bufferedColor = $$props.bufferedColor);
    		if ('chunkBars' in $$props) $$invalidate(55, chunkBars = $$props.chunkBars);
    		if ('borderRadius' in $$props) $$invalidate(5, borderRadius = $$props.borderRadius);
    		if ('loop' in $$props) $$invalidate(56, loop = $$props.loop);
    		if ('skipSeconds' in $$props) $$invalidate(57, skipSeconds = $$props.skipSeconds);
    		if ('aspectRatio' in $$props) $$invalidate(6, aspectRatio = $$props.aspectRatio);
    		if ('controlsOnPause' in $$props) $$invalidate(58, controlsOnPause = $$props.controlsOnPause);
    		if ('timeDisplay' in $$props) $$invalidate(7, timeDisplay = $$props.timeDisplay);
    		if ('videoPlayerElement' in $$props) $$invalidate(18, videoPlayerElement = $$props.videoPlayerElement);
    		if ('videoElement' in $$props) $$invalidate(8, videoElement = $$props.videoElement);
    		if ('currentTime' in $$props) $$invalidate(9, currentTime = $$props.currentTime);
    		if ('duration' in $$props) $$invalidate(19, duration = $$props.duration);
    		if ('buffered' in $$props) $$invalidate(20, buffered = $$props.buffered);
    		if ('played' in $$props) $$invalidate(21, played = $$props.played);
    		if ('seeking' in $$props) $$invalidate(10, seeking = $$props.seeking);
    		if ('ended' in $$props) $$invalidate(11, ended = $$props.ended);
    		if ('paused' in $$props) $$invalidate(12, paused = $$props.paused);
    		if ('volume' in $$props) $$invalidate(13, volume = $$props.volume);
    		if ('muteVolume' in $$props) muteVolume = $$props.muteVolume;
    		if ('isVideoData' in $$props) $$invalidate(14, isVideoData = $$props.isVideoData);
    		if ('isPointerOverVideo' in $$props) $$invalidate(59, isPointerOverVideo = $$props.isPointerOverVideo);
    		if ('isPointerOverControls' in $$props) $$invalidate(22, isPointerOverControls = $$props.isPointerOverControls);
    		if ('isBuffering' in $$props) $$invalidate(15, isBuffering = $$props.isBuffering);
    		if ('isFullscreenEnabled' in $$props) $$invalidate(23, isFullscreenEnabled = $$props.isFullscreenEnabled);
    		if ('isFullscreen' in $$props) $$invalidate(24, isFullscreen = $$props.isFullscreen);
    		if ('isIdle' in $$props) $$invalidate(16, isIdle = $$props.isIdle);
    		if ('isScrolling' in $$props) $$invalidate(25, isScrolling = $$props.isScrolling);
    		if ('isScrubbing' in $$props) $$invalidate(17, isScrubbing = $$props.isScrubbing);
    		if ('isKeyDown' in $$props) isKeyDown = $$props.isKeyDown;
    		if ('muted' in $$props) $$invalidate(26, muted = $$props.muted);
    		if ('_skipSeconds' in $$props) _skipSeconds = $$props._skipSeconds;
    		if ('isBottomControlsVisible' in $$props) $$invalidate(27, isBottomControlsVisible = $$props.isBottomControlsVisible);
    		if ('isCenterIconVisibile' in $$props) $$invalidate(28, isCenterIconVisibile = $$props.isCenterIconVisibile);
    		if ('isSpinnerVisible' in $$props) $$invalidate(29, isSpinnerVisible = $$props.isSpinnerVisible);
    		if ('isPosterVisible' in $$props) $$invalidate(30, isPosterVisible = $$props.isPosterVisible);
    		if ('_sources' in $$props) $$invalidate(31, _sources = $$props._sources);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[1] & /*source*/ 32768) {
    			$$invalidate(31, _sources = prepareVideoSources(source));
    		}

    		if ($$self.$$.dirty[1] & /*skipSeconds*/ 67108864) {
    			_skipSeconds = parseFloat(skipSeconds);
    		}

    		if ($$self.$$.dirty[1] & /*controlsHeight*/ 65536) {
    			set_store_value(config, $config.controlsHeight = controlsHeight, $config);
    		}

    		if ($$self.$$.dirty[1] & /*thumbSize*/ 262144) {
    			set_store_value(config, $config.thumbSize = thumbSize, $config);
    		}

    		if ($$self.$$.dirty[1] & /*trackHeight*/ 131072) {
    			set_store_value(config, $config.trackHeight = trackHeight, $config);
    		}

    		if ($$self.$$.dirty[1] & /*centerIconSize*/ 524288) {
    			set_store_value(config, $config.centerIconSize = centerIconSize, $config);
    		}

    		if ($$self.$$.dirty[1] & /*color*/ 1048576) {
    			set_store_value(config, $config.color = color, $config);
    		}

    		if ($$self.$$.dirty[0] & /*playerBgColor*/ 8) {
    			set_store_value(config, $config.playerBgColor = playerBgColor, $config);
    		}

    		if ($$self.$$.dirty[1] & /*focusColor*/ 2097152) {
    			set_store_value(config, $config.focusColor = focusColor, $config);
    		}

    		if ($$self.$$.dirty[1] & /*barsBgColor*/ 4194304) {
    			set_store_value(config, $config.barsBgColor = barsBgColor, $config);
    		}

    		if ($$self.$$.dirty[0] & /*iconColor*/ 16) {
    			set_store_value(config, $config.iconColor = iconColor, $config);
    		}

    		if ($$self.$$.dirty[1] & /*bufferedColor*/ 8388608) {
    			set_store_value(config, $config.bufferedColor = bufferedColor, $config);
    		}

    		if ($$self.$$.dirty[1] & /*chunkBars*/ 16777216) {
    			set_store_value(config, $config.chunkBars = chunkBars, $config);
    		}

    		if ($$self.$$.dirty[1] & /*loop*/ 33554432) {
    			set_store_value(config, $config.loop = loop, $config);
    		}

    		if ($$self.$$.dirty[0] & /*borderRadius*/ 32) {
    			set_store_value(config, $config.borderRadius = borderRadius, $config);
    		}

    		if ($$self.$$.dirty[1] & /*controlsOnPause*/ 134217728) {
    			set_store_value(config, $config.controlsOnPause = controlsOnPause, $config);
    		}

    		if ($$self.$$.dirty[0] & /*timeDisplay*/ 128) {
    			set_store_value(config, $config.timeDisplay = timeDisplay, $config);
    		}

    		if ($$self.$$.dirty[0] & /*volume*/ 8192) {
    			$$invalidate(26, muted = volume == 0);
    		}

    		if ($$self.$$.dirty[0] & /*ended, videoElement*/ 2304 | $$self.$$.dirty[1] & /*loop*/ 33554432) {
    			{
    				if (ended) {
    					$$invalidate(9, currentTime = 0);
    					if (loop) videoElement.play();
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*isVideoData, paused, currentTime*/ 20992) {
    			$$invalidate(30, isPosterVisible = !isVideoData || paused && currentTime == 0);
    		}

    		if ($$self.$$.dirty[0] & /*isVideoData, paused, isIdle*/ 86016 | $$self.$$.dirty[1] & /*controlsOnPause, isPointerOverVideo*/ 402653184) {
    			$$invalidate(27, isBottomControlsVisible = isVideoData && (paused && controlsOnPause || isPointerOverVideo && !isIdle));
    		}

    		if ($$self.$$.dirty[0] & /*seeking, isBuffering*/ 33792) {
    			$$invalidate(29, isSpinnerVisible = seeking || isBuffering);
    		}

    		if ($$self.$$.dirty[0] & /*isVideoData, paused, isScrubbing*/ 151552) {
    			$$invalidate(28, isCenterIconVisibile = !isVideoData || paused && !isScrubbing);
    		}
    	};

    	return [
    		width,
    		height,
    		poster,
    		playerBgColor,
    		iconColor,
    		borderRadius,
    		aspectRatio,
    		timeDisplay,
    		videoElement,
    		currentTime,
    		seeking,
    		ended,
    		paused,
    		volume,
    		isVideoData,
    		isBuffering,
    		isIdle,
    		isScrubbing,
    		videoPlayerElement,
    		duration,
    		buffered,
    		played,
    		isPointerOverControls,
    		isFullscreenEnabled,
    		isFullscreen,
    		isScrolling,
    		muted,
    		isBottomControlsVisible,
    		isCenterIconVisibile,
    		isSpinnerVisible,
    		isPosterVisible,
    		_sources,
    		config,
    		onVideoLoadedData,
    		onVideoPlaying,
    		onVideoWaiting,
    		onPlayerPointerOver,
    		onPlayerPointerOut,
    		onPlayerPointerUp,
    		onWindowKeyDown,
    		onWindowKeyUp,
    		onFullscreenButtonPointerUp,
    		onPlaybarPointerUp,
    		onPlayPauseButtonPointerUp,
    		onVolumeButtonPointerUp,
    		togglePause,
    		source,
    		controlsHeight,
    		trackHeight,
    		thumbSize,
    		centerIconSize,
    		color,
    		focusColor,
    		barsBgColor,
    		bufferedColor,
    		chunkBars,
    		loop,
    		skipSeconds,
    		controlsOnPause,
    		isPointerOverVideo,
    		video_binding,
    		video_timeupdate_handler,
    		video_durationchange_handler,
    		video_progress_handler,
    		video_loadedmetadata_handler,
    		video_seeking_seeked_handler,
    		video_ended_handler,
    		video_play_pause_handler,
    		video_volumechange_handler,
    		playbar_currentTime_binding,
    		playbar_paused_binding,
    		playbar_isScrubbing_binding,
    		volumecontrol_volume_binding,
    		bottomcontrols_isPointerOver_binding,
    		div_binding,
    		idledetector_isIdle_binding,
    		scrolldetector_isScrolling_binding,
    		fullscreenmanager_isFullscreenEnabled_binding,
    		fullscreenmanager_isFullscreen_binding
    	];
    }

    class VideoPlayerClient extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$5,
    			create_fragment$5,
    			safe_not_equal,
    			{
    				width: 0,
    				height: 1,
    				poster: 2,
    				source: 46,
    				controlsHeight: 47,
    				trackHeight: 48,
    				thumbSize: 49,
    				centerIconSize: 50,
    				playerBgColor: 3,
    				color: 51,
    				focusColor: 52,
    				barsBgColor: 53,
    				iconColor: 4,
    				bufferedColor: 54,
    				chunkBars: 55,
    				borderRadius: 5,
    				loop: 56,
    				skipSeconds: 57,
    				aspectRatio: 6,
    				controlsOnPause: 58,
    				timeDisplay: 7
    			},
    			null,
    			[-1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "VideoPlayerClient",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*width*/ ctx[0] === undefined && !('width' in props)) {
    			console.warn("<VideoPlayerClient> was created without expected prop 'width'");
    		}

    		if (/*height*/ ctx[1] === undefined && !('height' in props)) {
    			console.warn("<VideoPlayerClient> was created without expected prop 'height'");
    		}

    		if (/*poster*/ ctx[2] === undefined && !('poster' in props)) {
    			console.warn("<VideoPlayerClient> was created without expected prop 'poster'");
    		}

    		if (/*source*/ ctx[46] === undefined && !('source' in props)) {
    			console.warn("<VideoPlayerClient> was created without expected prop 'source'");
    		}

    		if (/*controlsHeight*/ ctx[47] === undefined && !('controlsHeight' in props)) {
    			console.warn("<VideoPlayerClient> was created without expected prop 'controlsHeight'");
    		}

    		if (/*trackHeight*/ ctx[48] === undefined && !('trackHeight' in props)) {
    			console.warn("<VideoPlayerClient> was created without expected prop 'trackHeight'");
    		}

    		if (/*thumbSize*/ ctx[49] === undefined && !('thumbSize' in props)) {
    			console.warn("<VideoPlayerClient> was created without expected prop 'thumbSize'");
    		}

    		if (/*centerIconSize*/ ctx[50] === undefined && !('centerIconSize' in props)) {
    			console.warn("<VideoPlayerClient> was created without expected prop 'centerIconSize'");
    		}

    		if (/*playerBgColor*/ ctx[3] === undefined && !('playerBgColor' in props)) {
    			console.warn("<VideoPlayerClient> was created without expected prop 'playerBgColor'");
    		}

    		if (/*color*/ ctx[51] === undefined && !('color' in props)) {
    			console.warn("<VideoPlayerClient> was created without expected prop 'color'");
    		}

    		if (/*focusColor*/ ctx[52] === undefined && !('focusColor' in props)) {
    			console.warn("<VideoPlayerClient> was created without expected prop 'focusColor'");
    		}

    		if (/*barsBgColor*/ ctx[53] === undefined && !('barsBgColor' in props)) {
    			console.warn("<VideoPlayerClient> was created without expected prop 'barsBgColor'");
    		}

    		if (/*iconColor*/ ctx[4] === undefined && !('iconColor' in props)) {
    			console.warn("<VideoPlayerClient> was created without expected prop 'iconColor'");
    		}

    		if (/*bufferedColor*/ ctx[54] === undefined && !('bufferedColor' in props)) {
    			console.warn("<VideoPlayerClient> was created without expected prop 'bufferedColor'");
    		}

    		if (/*chunkBars*/ ctx[55] === undefined && !('chunkBars' in props)) {
    			console.warn("<VideoPlayerClient> was created without expected prop 'chunkBars'");
    		}

    		if (/*borderRadius*/ ctx[5] === undefined && !('borderRadius' in props)) {
    			console.warn("<VideoPlayerClient> was created without expected prop 'borderRadius'");
    		}

    		if (/*loop*/ ctx[56] === undefined && !('loop' in props)) {
    			console.warn("<VideoPlayerClient> was created without expected prop 'loop'");
    		}

    		if (/*skipSeconds*/ ctx[57] === undefined && !('skipSeconds' in props)) {
    			console.warn("<VideoPlayerClient> was created without expected prop 'skipSeconds'");
    		}

    		if (/*aspectRatio*/ ctx[6] === undefined && !('aspectRatio' in props)) {
    			console.warn("<VideoPlayerClient> was created without expected prop 'aspectRatio'");
    		}

    		if (/*controlsOnPause*/ ctx[58] === undefined && !('controlsOnPause' in props)) {
    			console.warn("<VideoPlayerClient> was created without expected prop 'controlsOnPause'");
    		}

    		if (/*timeDisplay*/ ctx[7] === undefined && !('timeDisplay' in props)) {
    			console.warn("<VideoPlayerClient> was created without expected prop 'timeDisplay'");
    		}
    	}

    	get width() {
    		throw new Error("<VideoPlayerClient>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<VideoPlayerClient>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<VideoPlayerClient>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<VideoPlayerClient>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get poster() {
    		throw new Error("<VideoPlayerClient>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set poster(value) {
    		throw new Error("<VideoPlayerClient>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get source() {
    		throw new Error("<VideoPlayerClient>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set source(value) {
    		throw new Error("<VideoPlayerClient>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get controlsHeight() {
    		throw new Error("<VideoPlayerClient>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set controlsHeight(value) {
    		throw new Error("<VideoPlayerClient>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get trackHeight() {
    		throw new Error("<VideoPlayerClient>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set trackHeight(value) {
    		throw new Error("<VideoPlayerClient>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get thumbSize() {
    		throw new Error("<VideoPlayerClient>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set thumbSize(value) {
    		throw new Error("<VideoPlayerClient>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get centerIconSize() {
    		throw new Error("<VideoPlayerClient>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set centerIconSize(value) {
    		throw new Error("<VideoPlayerClient>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get playerBgColor() {
    		throw new Error("<VideoPlayerClient>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set playerBgColor(value) {
    		throw new Error("<VideoPlayerClient>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<VideoPlayerClient>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<VideoPlayerClient>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focusColor() {
    		throw new Error("<VideoPlayerClient>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set focusColor(value) {
    		throw new Error("<VideoPlayerClient>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get barsBgColor() {
    		throw new Error("<VideoPlayerClient>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set barsBgColor(value) {
    		throw new Error("<VideoPlayerClient>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconColor() {
    		throw new Error("<VideoPlayerClient>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconColor(value) {
    		throw new Error("<VideoPlayerClient>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bufferedColor() {
    		throw new Error("<VideoPlayerClient>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bufferedColor(value) {
    		throw new Error("<VideoPlayerClient>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get chunkBars() {
    		throw new Error("<VideoPlayerClient>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set chunkBars(value) {
    		throw new Error("<VideoPlayerClient>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get borderRadius() {
    		throw new Error("<VideoPlayerClient>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set borderRadius(value) {
    		throw new Error("<VideoPlayerClient>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get loop() {
    		throw new Error("<VideoPlayerClient>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set loop(value) {
    		throw new Error("<VideoPlayerClient>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get skipSeconds() {
    		throw new Error("<VideoPlayerClient>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set skipSeconds(value) {
    		throw new Error("<VideoPlayerClient>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get aspectRatio() {
    		throw new Error("<VideoPlayerClient>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set aspectRatio(value) {
    		throw new Error("<VideoPlayerClient>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get controlsOnPause() {
    		throw new Error("<VideoPlayerClient>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set controlsOnPause(value) {
    		throw new Error("<VideoPlayerClient>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get timeDisplay() {
    		throw new Error("<VideoPlayerClient>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set timeDisplay(value) {
    		throw new Error("<VideoPlayerClient>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-video-player/src/VideoPlayerServer.svelte generated by Svelte v3.48.0 */

    const file$3 = "node_modules/svelte-video-player/src/VideoPlayerServer.svelte";

    function create_fragment$4(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "aspect svelte-1sqfmr5");
    			set_style(div, "padding-top", /*aspectRatio*/ ctx[2] * 100 + "%");
    			set_style(div, "background-color", /*playerBgColor*/ ctx[0]);
    			set_style(div, "border-radius", /*borderRadius*/ ctx[1]);
    			add_location(div, file$3, 20, 0, 453);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*aspectRatio*/ 4) {
    				set_style(div, "padding-top", /*aspectRatio*/ ctx[2] * 100 + "%");
    			}

    			if (dirty & /*playerBgColor*/ 1) {
    				set_style(div, "background-color", /*playerBgColor*/ ctx[0]);
    			}

    			if (dirty & /*borderRadius*/ 2) {
    				set_style(div, "border-radius", /*borderRadius*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('VideoPlayerServer', slots, []);
    	let { playerBgColor } = $$props;
    	let { borderRadius } = $$props;
    	let { aspectRatio } = $$props;
    	const writable_props = ['playerBgColor', 'borderRadius', 'aspectRatio'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<VideoPlayerServer> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('playerBgColor' in $$props) $$invalidate(0, playerBgColor = $$props.playerBgColor);
    		if ('borderRadius' in $$props) $$invalidate(1, borderRadius = $$props.borderRadius);
    		if ('aspectRatio' in $$props) $$invalidate(2, aspectRatio = $$props.aspectRatio);
    	};

    	$$self.$capture_state = () => ({ playerBgColor, borderRadius, aspectRatio });

    	$$self.$inject_state = $$props => {
    		if ('playerBgColor' in $$props) $$invalidate(0, playerBgColor = $$props.playerBgColor);
    		if ('borderRadius' in $$props) $$invalidate(1, borderRadius = $$props.borderRadius);
    		if ('aspectRatio' in $$props) $$invalidate(2, aspectRatio = $$props.aspectRatio);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [playerBgColor, borderRadius, aspectRatio];
    }

    class VideoPlayerServer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			playerBgColor: 0,
    			borderRadius: 1,
    			aspectRatio: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "VideoPlayerServer",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*playerBgColor*/ ctx[0] === undefined && !('playerBgColor' in props)) {
    			console.warn("<VideoPlayerServer> was created without expected prop 'playerBgColor'");
    		}

    		if (/*borderRadius*/ ctx[1] === undefined && !('borderRadius' in props)) {
    			console.warn("<VideoPlayerServer> was created without expected prop 'borderRadius'");
    		}

    		if (/*aspectRatio*/ ctx[2] === undefined && !('aspectRatio' in props)) {
    			console.warn("<VideoPlayerServer> was created without expected prop 'aspectRatio'");
    		}
    	}

    	get playerBgColor() {
    		throw new Error("<VideoPlayerServer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set playerBgColor(value) {
    		throw new Error("<VideoPlayerServer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get borderRadius() {
    		throw new Error("<VideoPlayerServer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set borderRadius(value) {
    		throw new Error("<VideoPlayerServer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get aspectRatio() {
    		throw new Error("<VideoPlayerServer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set aspectRatio(value) {
    		throw new Error("<VideoPlayerServer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-video-player/src/VideoPlayer.svelte generated by Svelte v3.48.0 */

    // (60:0) {:else}
    function create_else_block(ctx) {
    	let videoplayerserver;
    	let current;

    	videoplayerserver = new VideoPlayerServer({
    			props: {
    				playerBgColor: /*playerBgColor*/ ctx[8],
    				borderRadius: /*borderRadius*/ ctx[15],
    				aspectRatio: /*aspectRatio*/ ctx[20]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(videoplayerserver.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(videoplayerserver, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const videoplayerserver_changes = {};
    			if (dirty & /*playerBgColor*/ 256) videoplayerserver_changes.playerBgColor = /*playerBgColor*/ ctx[8];
    			if (dirty & /*borderRadius*/ 32768) videoplayerserver_changes.borderRadius = /*borderRadius*/ ctx[15];
    			if (dirty & /*aspectRatio*/ 1048576) videoplayerserver_changes.aspectRatio = /*aspectRatio*/ ctx[20];
    			videoplayerserver.$set(videoplayerserver_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(videoplayerserver.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(videoplayerserver.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(videoplayerserver, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(60:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (37:0) {#if isClient}
    function create_if_block(ctx) {
    	let videoplayerclient;
    	let current;

    	videoplayerclient = new VideoPlayerClient({
    			props: {
    				width: /*width*/ ctx[0],
    				height: /*height*/ ctx[1],
    				poster: /*poster*/ ctx[2],
    				source: /*source*/ ctx[3],
    				controlsHeight: /*controlsHeight*/ ctx[4],
    				trackHeight: /*trackHeight*/ ctx[5],
    				thumbSize: /*thumbSize*/ ctx[6],
    				centerIconSize: /*centerIconSize*/ ctx[7],
    				playerBgColor: /*playerBgColor*/ ctx[8],
    				color: /*color*/ ctx[9],
    				focusColor: /*focusColor*/ ctx[10],
    				barsBgColor: /*barsBgColor*/ ctx[11],
    				iconColor: /*iconColor*/ ctx[12],
    				bufferedColor: /*bufferedColor*/ ctx[13],
    				chunkBars: /*chunkBars*/ ctx[14],
    				borderRadius: /*borderRadius*/ ctx[15],
    				loop: /*loop*/ ctx[16],
    				skipSeconds: /*skipSeconds*/ ctx[17],
    				aspectRatio: /*aspectRatio*/ ctx[20],
    				controlsOnPause: /*controlsOnPause*/ ctx[18],
    				timeDisplay: /*timeDisplay*/ ctx[19]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(videoplayerclient.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(videoplayerclient, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const videoplayerclient_changes = {};
    			if (dirty & /*width*/ 1) videoplayerclient_changes.width = /*width*/ ctx[0];
    			if (dirty & /*height*/ 2) videoplayerclient_changes.height = /*height*/ ctx[1];
    			if (dirty & /*poster*/ 4) videoplayerclient_changes.poster = /*poster*/ ctx[2];
    			if (dirty & /*source*/ 8) videoplayerclient_changes.source = /*source*/ ctx[3];
    			if (dirty & /*controlsHeight*/ 16) videoplayerclient_changes.controlsHeight = /*controlsHeight*/ ctx[4];
    			if (dirty & /*trackHeight*/ 32) videoplayerclient_changes.trackHeight = /*trackHeight*/ ctx[5];
    			if (dirty & /*thumbSize*/ 64) videoplayerclient_changes.thumbSize = /*thumbSize*/ ctx[6];
    			if (dirty & /*centerIconSize*/ 128) videoplayerclient_changes.centerIconSize = /*centerIconSize*/ ctx[7];
    			if (dirty & /*playerBgColor*/ 256) videoplayerclient_changes.playerBgColor = /*playerBgColor*/ ctx[8];
    			if (dirty & /*color*/ 512) videoplayerclient_changes.color = /*color*/ ctx[9];
    			if (dirty & /*focusColor*/ 1024) videoplayerclient_changes.focusColor = /*focusColor*/ ctx[10];
    			if (dirty & /*barsBgColor*/ 2048) videoplayerclient_changes.barsBgColor = /*barsBgColor*/ ctx[11];
    			if (dirty & /*iconColor*/ 4096) videoplayerclient_changes.iconColor = /*iconColor*/ ctx[12];
    			if (dirty & /*bufferedColor*/ 8192) videoplayerclient_changes.bufferedColor = /*bufferedColor*/ ctx[13];
    			if (dirty & /*chunkBars*/ 16384) videoplayerclient_changes.chunkBars = /*chunkBars*/ ctx[14];
    			if (dirty & /*borderRadius*/ 32768) videoplayerclient_changes.borderRadius = /*borderRadius*/ ctx[15];
    			if (dirty & /*loop*/ 65536) videoplayerclient_changes.loop = /*loop*/ ctx[16];
    			if (dirty & /*skipSeconds*/ 131072) videoplayerclient_changes.skipSeconds = /*skipSeconds*/ ctx[17];
    			if (dirty & /*aspectRatio*/ 1048576) videoplayerclient_changes.aspectRatio = /*aspectRatio*/ ctx[20];
    			if (dirty & /*controlsOnPause*/ 262144) videoplayerclient_changes.controlsOnPause = /*controlsOnPause*/ ctx[18];
    			if (dirty & /*timeDisplay*/ 524288) videoplayerclient_changes.timeDisplay = /*timeDisplay*/ ctx[19];
    			videoplayerclient.$set(videoplayerclient_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(videoplayerclient.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(videoplayerclient.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(videoplayerclient, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(37:0) {#if isClient}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*isClient*/ ctx[21]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let _width;
    	let _height;
    	let aspectRatio;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('VideoPlayer', slots, []);
    	let isClient = typeof window !== 'undefined' ? true : false;
    	let { width = 1920 } = $$props;
    	let { height = 1080 } = $$props;
    	let { poster = '' } = $$props;
    	let { source = '' } = $$props;
    	let { controlsHeight = '55px' } = $$props;
    	let { trackHeight = '6px' } = $$props;
    	let { thumbSize = '15px' } = $$props;
    	let { centerIconSize = '60px' } = $$props;
    	let { playerBgColor = 'black' } = $$props;
    	let { color = '#FF3E00' } = $$props;
    	let { focusColor = 'white' } = $$props;
    	let { barsBgColor = 'white' } = $$props;
    	let { iconColor = 'white' } = $$props;
    	let { bufferedColor = '#FF9600' } = $$props;
    	let { chunkBars = false } = $$props;
    	let { borderRadius = '8px' } = $$props;
    	let { loop = false } = $$props;
    	let { skipSeconds = 5 } = $$props;
    	let { controlsOnPause = true } = $$props;
    	let { timeDisplay = false } = $$props;

    	const writable_props = [
    		'width',
    		'height',
    		'poster',
    		'source',
    		'controlsHeight',
    		'trackHeight',
    		'thumbSize',
    		'centerIconSize',
    		'playerBgColor',
    		'color',
    		'focusColor',
    		'barsBgColor',
    		'iconColor',
    		'bufferedColor',
    		'chunkBars',
    		'borderRadius',
    		'loop',
    		'skipSeconds',
    		'controlsOnPause',
    		'timeDisplay'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<VideoPlayer> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('poster' in $$props) $$invalidate(2, poster = $$props.poster);
    		if ('source' in $$props) $$invalidate(3, source = $$props.source);
    		if ('controlsHeight' in $$props) $$invalidate(4, controlsHeight = $$props.controlsHeight);
    		if ('trackHeight' in $$props) $$invalidate(5, trackHeight = $$props.trackHeight);
    		if ('thumbSize' in $$props) $$invalidate(6, thumbSize = $$props.thumbSize);
    		if ('centerIconSize' in $$props) $$invalidate(7, centerIconSize = $$props.centerIconSize);
    		if ('playerBgColor' in $$props) $$invalidate(8, playerBgColor = $$props.playerBgColor);
    		if ('color' in $$props) $$invalidate(9, color = $$props.color);
    		if ('focusColor' in $$props) $$invalidate(10, focusColor = $$props.focusColor);
    		if ('barsBgColor' in $$props) $$invalidate(11, barsBgColor = $$props.barsBgColor);
    		if ('iconColor' in $$props) $$invalidate(12, iconColor = $$props.iconColor);
    		if ('bufferedColor' in $$props) $$invalidate(13, bufferedColor = $$props.bufferedColor);
    		if ('chunkBars' in $$props) $$invalidate(14, chunkBars = $$props.chunkBars);
    		if ('borderRadius' in $$props) $$invalidate(15, borderRadius = $$props.borderRadius);
    		if ('loop' in $$props) $$invalidate(16, loop = $$props.loop);
    		if ('skipSeconds' in $$props) $$invalidate(17, skipSeconds = $$props.skipSeconds);
    		if ('controlsOnPause' in $$props) $$invalidate(18, controlsOnPause = $$props.controlsOnPause);
    		if ('timeDisplay' in $$props) $$invalidate(19, timeDisplay = $$props.timeDisplay);
    	};

    	$$self.$capture_state = () => ({
    		VideoPlayerClient,
    		VideoPlayerServer,
    		isClient,
    		width,
    		height,
    		poster,
    		source,
    		controlsHeight,
    		trackHeight,
    		thumbSize,
    		centerIconSize,
    		playerBgColor,
    		color,
    		focusColor,
    		barsBgColor,
    		iconColor,
    		bufferedColor,
    		chunkBars,
    		borderRadius,
    		loop,
    		skipSeconds,
    		controlsOnPause,
    		timeDisplay,
    		_width,
    		_height,
    		aspectRatio
    	});

    	$$self.$inject_state = $$props => {
    		if ('isClient' in $$props) $$invalidate(21, isClient = $$props.isClient);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('poster' in $$props) $$invalidate(2, poster = $$props.poster);
    		if ('source' in $$props) $$invalidate(3, source = $$props.source);
    		if ('controlsHeight' in $$props) $$invalidate(4, controlsHeight = $$props.controlsHeight);
    		if ('trackHeight' in $$props) $$invalidate(5, trackHeight = $$props.trackHeight);
    		if ('thumbSize' in $$props) $$invalidate(6, thumbSize = $$props.thumbSize);
    		if ('centerIconSize' in $$props) $$invalidate(7, centerIconSize = $$props.centerIconSize);
    		if ('playerBgColor' in $$props) $$invalidate(8, playerBgColor = $$props.playerBgColor);
    		if ('color' in $$props) $$invalidate(9, color = $$props.color);
    		if ('focusColor' in $$props) $$invalidate(10, focusColor = $$props.focusColor);
    		if ('barsBgColor' in $$props) $$invalidate(11, barsBgColor = $$props.barsBgColor);
    		if ('iconColor' in $$props) $$invalidate(12, iconColor = $$props.iconColor);
    		if ('bufferedColor' in $$props) $$invalidate(13, bufferedColor = $$props.bufferedColor);
    		if ('chunkBars' in $$props) $$invalidate(14, chunkBars = $$props.chunkBars);
    		if ('borderRadius' in $$props) $$invalidate(15, borderRadius = $$props.borderRadius);
    		if ('loop' in $$props) $$invalidate(16, loop = $$props.loop);
    		if ('skipSeconds' in $$props) $$invalidate(17, skipSeconds = $$props.skipSeconds);
    		if ('controlsOnPause' in $$props) $$invalidate(18, controlsOnPause = $$props.controlsOnPause);
    		if ('timeDisplay' in $$props) $$invalidate(19, timeDisplay = $$props.timeDisplay);
    		if ('_width' in $$props) $$invalidate(22, _width = $$props._width);
    		if ('_height' in $$props) $$invalidate(23, _height = $$props._height);
    		if ('aspectRatio' in $$props) $$invalidate(20, aspectRatio = $$props.aspectRatio);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*width*/ 1) {
    			$$invalidate(22, _width = parseInt(width));
    		}

    		if ($$self.$$.dirty & /*height*/ 2) {
    			$$invalidate(23, _height = parseInt(height));
    		}

    		if ($$self.$$.dirty & /*_height, _width*/ 12582912) {
    			$$invalidate(20, aspectRatio = _height / _width);
    		}
    	};

    	return [
    		width,
    		height,
    		poster,
    		source,
    		controlsHeight,
    		trackHeight,
    		thumbSize,
    		centerIconSize,
    		playerBgColor,
    		color,
    		focusColor,
    		barsBgColor,
    		iconColor,
    		bufferedColor,
    		chunkBars,
    		borderRadius,
    		loop,
    		skipSeconds,
    		controlsOnPause,
    		timeDisplay,
    		aspectRatio,
    		isClient,
    		_width,
    		_height
    	];
    }

    class VideoPlayer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			width: 0,
    			height: 1,
    			poster: 2,
    			source: 3,
    			controlsHeight: 4,
    			trackHeight: 5,
    			thumbSize: 6,
    			centerIconSize: 7,
    			playerBgColor: 8,
    			color: 9,
    			focusColor: 10,
    			barsBgColor: 11,
    			iconColor: 12,
    			bufferedColor: 13,
    			chunkBars: 14,
    			borderRadius: 15,
    			loop: 16,
    			skipSeconds: 17,
    			controlsOnPause: 18,
    			timeDisplay: 19
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "VideoPlayer",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get width() {
    		throw new Error("<VideoPlayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<VideoPlayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<VideoPlayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<VideoPlayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get poster() {
    		throw new Error("<VideoPlayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set poster(value) {
    		throw new Error("<VideoPlayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get source() {
    		throw new Error("<VideoPlayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set source(value) {
    		throw new Error("<VideoPlayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get controlsHeight() {
    		throw new Error("<VideoPlayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set controlsHeight(value) {
    		throw new Error("<VideoPlayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get trackHeight() {
    		throw new Error("<VideoPlayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set trackHeight(value) {
    		throw new Error("<VideoPlayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get thumbSize() {
    		throw new Error("<VideoPlayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set thumbSize(value) {
    		throw new Error("<VideoPlayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get centerIconSize() {
    		throw new Error("<VideoPlayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set centerIconSize(value) {
    		throw new Error("<VideoPlayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get playerBgColor() {
    		throw new Error("<VideoPlayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set playerBgColor(value) {
    		throw new Error("<VideoPlayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<VideoPlayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<VideoPlayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focusColor() {
    		throw new Error("<VideoPlayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set focusColor(value) {
    		throw new Error("<VideoPlayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get barsBgColor() {
    		throw new Error("<VideoPlayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set barsBgColor(value) {
    		throw new Error("<VideoPlayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconColor() {
    		throw new Error("<VideoPlayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconColor(value) {
    		throw new Error("<VideoPlayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bufferedColor() {
    		throw new Error("<VideoPlayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bufferedColor(value) {
    		throw new Error("<VideoPlayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get chunkBars() {
    		throw new Error("<VideoPlayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set chunkBars(value) {
    		throw new Error("<VideoPlayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get borderRadius() {
    		throw new Error("<VideoPlayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set borderRadius(value) {
    		throw new Error("<VideoPlayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get loop() {
    		throw new Error("<VideoPlayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set loop(value) {
    		throw new Error("<VideoPlayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get skipSeconds() {
    		throw new Error("<VideoPlayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set skipSeconds(value) {
    		throw new Error("<VideoPlayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get controlsOnPause() {
    		throw new Error("<VideoPlayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set controlsOnPause(value) {
    		throw new Error("<VideoPlayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get timeDisplay() {
    		throw new Error("<VideoPlayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set timeDisplay(value) {
    		throw new Error("<VideoPlayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/PerformerDescription.svelte generated by Svelte v3.48.0 */
    const file$2 = "src/PerformerDescription.svelte";

    function create_fragment$2(ctx) {
    	let main;
    	let div0;
    	let h1;
    	let t0;
    	let t1;
    	let a0;
    	let t2;
    	let t3;
    	let div3;
    	let span;
    	let videoplayer;
    	let t4;
    	let div1;
    	let p0;
    	let t5;
    	let t6;
    	let div2;
    	let p1;
    	let a1;
    	let t7;
    	let current;

    	videoplayer = new VideoPlayer({
    			props: {
    				width: "800",
    				height: "400",
    				poster: /*url_portrait*/ ctx[3],
    				source: /*video*/ ctx[5]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			div0 = element("div");
    			h1 = element("h1");
    			t0 = text(/*name*/ ctx[0]);
    			t1 = space();
    			a0 = element("a");
    			t2 = text(/*pseudo*/ ctx[1]);
    			t3 = space();
    			div3 = element("div");
    			span = element("span");
    			create_component(videoplayer.$$.fragment);
    			t4 = space();
    			div1 = element("div");
    			p0 = element("p");
    			t5 = text(/*description*/ ctx[2]);
    			t6 = space();
    			div2 = element("div");
    			p1 = element("p");
    			a1 = element("a");
    			t7 = text("Site internet");
    			attr_dev(h1, "class", "artistname svelte-itmvzy");
    			add_location(h1, file$2, 14, 8, 261);
    			attr_dev(a0, "href", /*link*/ ctx[4]);
    			attr_dev(a0, "class", "name_with_link svelte-itmvzy");
    			add_location(a0, file$2, 15, 8, 304);
    			attr_dev(div0, "class", "box_header svelte-itmvzy");
    			add_location(div0, file$2, 13, 4, 228);
    			attr_dev(span, "class", "video_item svelte-itmvzy");
    			add_location(span, file$2, 20, 8, 402);
    			attr_dev(p0, "class", "artistdescription svelte-itmvzy");
    			add_location(p0, file$2, 25, 12, 575);
    			attr_dev(div1, "class", "text_item svelte-itmvzy");
    			add_location(div1, file$2, 24, 8, 539);
    			attr_dev(a1, "href", /*link*/ ctx[4]);
    			attr_dev(a1, "class", "svelte-itmvzy");
    			add_location(a1, file$2, 29, 41, 711);
    			attr_dev(p1, "class", "artistdescription svelte-itmvzy");
    			add_location(p1, file$2, 29, 12, 682);
    			attr_dev(div2, "class", "link_item svelte-itmvzy");
    			add_location(div2, file$2, 28, 8, 646);
    			attr_dev(div3, "class", "content svelte-itmvzy");
    			add_location(div3, file$2, 18, 4, 371);
    			attr_dev(main, "class", "svelte-itmvzy");
    			add_location(main, file$2, 11, 0, 216);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div0);
    			append_dev(div0, h1);
    			append_dev(h1, t0);
    			append_dev(div0, t1);
    			append_dev(div0, a0);
    			append_dev(a0, t2);
    			append_dev(main, t3);
    			append_dev(main, div3);
    			append_dev(div3, span);
    			mount_component(videoplayer, span, null);
    			append_dev(div3, t4);
    			append_dev(div3, div1);
    			append_dev(div1, p0);
    			append_dev(p0, t5);
    			append_dev(div3, t6);
    			append_dev(div3, div2);
    			append_dev(div2, p1);
    			append_dev(p1, a1);
    			append_dev(a1, t7);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*name*/ 1) set_data_dev(t0, /*name*/ ctx[0]);
    			if (!current || dirty & /*pseudo*/ 2) set_data_dev(t2, /*pseudo*/ ctx[1]);

    			if (!current || dirty & /*link*/ 16) {
    				attr_dev(a0, "href", /*link*/ ctx[4]);
    			}

    			const videoplayer_changes = {};
    			if (dirty & /*url_portrait*/ 8) videoplayer_changes.poster = /*url_portrait*/ ctx[3];
    			if (dirty & /*video*/ 32) videoplayer_changes.source = /*video*/ ctx[5];
    			videoplayer.$set(videoplayer_changes);
    			if (!current || dirty & /*description*/ 4) set_data_dev(t5, /*description*/ ctx[2]);

    			if (!current || dirty & /*link*/ 16) {
    				attr_dev(a1, "href", /*link*/ ctx[4]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(videoplayer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(videoplayer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(videoplayer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PerformerDescription', slots, []);
    	let { name } = $$props;
    	let { pseudo } = $$props;
    	let { description } = $$props;
    	let { url_portrait } = $$props;
    	let { link } = $$props;
    	let { video } = $$props;
    	const writable_props = ['name', 'pseudo', 'description', 'url_portrait', 'link', 'video'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PerformerDescription> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('pseudo' in $$props) $$invalidate(1, pseudo = $$props.pseudo);
    		if ('description' in $$props) $$invalidate(2, description = $$props.description);
    		if ('url_portrait' in $$props) $$invalidate(3, url_portrait = $$props.url_portrait);
    		if ('link' in $$props) $$invalidate(4, link = $$props.link);
    		if ('video' in $$props) $$invalidate(5, video = $$props.video);
    	};

    	$$self.$capture_state = () => ({
    		VideoPlayer,
    		name,
    		pseudo,
    		description,
    		url_portrait,
    		link,
    		video
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('pseudo' in $$props) $$invalidate(1, pseudo = $$props.pseudo);
    		if ('description' in $$props) $$invalidate(2, description = $$props.description);
    		if ('url_portrait' in $$props) $$invalidate(3, url_portrait = $$props.url_portrait);
    		if ('link' in $$props) $$invalidate(4, link = $$props.link);
    		if ('video' in $$props) $$invalidate(5, video = $$props.video);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name, pseudo, description, url_portrait, link, video];
    }

    class PerformerDescription extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			name: 0,
    			pseudo: 1,
    			description: 2,
    			url_portrait: 3,
    			link: 4,
    			video: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PerformerDescription",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !('name' in props)) {
    			console.warn("<PerformerDescription> was created without expected prop 'name'");
    		}

    		if (/*pseudo*/ ctx[1] === undefined && !('pseudo' in props)) {
    			console.warn("<PerformerDescription> was created without expected prop 'pseudo'");
    		}

    		if (/*description*/ ctx[2] === undefined && !('description' in props)) {
    			console.warn("<PerformerDescription> was created without expected prop 'description'");
    		}

    		if (/*url_portrait*/ ctx[3] === undefined && !('url_portrait' in props)) {
    			console.warn("<PerformerDescription> was created without expected prop 'url_portrait'");
    		}

    		if (/*link*/ ctx[4] === undefined && !('link' in props)) {
    			console.warn("<PerformerDescription> was created without expected prop 'link'");
    		}

    		if (/*video*/ ctx[5] === undefined && !('video' in props)) {
    			console.warn("<PerformerDescription> was created without expected prop 'video'");
    		}
    	}

    	get name() {
    		throw new Error("<PerformerDescription>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<PerformerDescription>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pseudo() {
    		throw new Error("<PerformerDescription>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pseudo(value) {
    		throw new Error("<PerformerDescription>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get description() {
    		throw new Error("<PerformerDescription>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set description(value) {
    		throw new Error("<PerformerDescription>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url_portrait() {
    		throw new Error("<PerformerDescription>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url_portrait(value) {
    		throw new Error("<PerformerDescription>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get link() {
    		throw new Error("<PerformerDescription>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set link(value) {
    		throw new Error("<PerformerDescription>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get video() {
    		throw new Error("<PerformerDescription>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set video(value) {
    		throw new Error("<PerformerDescription>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/MoreInformation.svelte generated by Svelte v3.48.0 */

    const file$1 = "src/MoreInformation.svelte";

    function create_fragment$1(ctx) {
    	let main;
    	let h1;
    	let t1;
    	let div;
    	let p0;
    	let t2;
    	let a0;
    	let t4;
    	let em0;
    	let t6;
    	let a1;
    	let t8;
    	let em1;
    	let t10;
    	let t11;
    	let p1;
    	let t12;
    	let em2;
    	let t14;
    	let em3;
    	let t16;

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "Live-Coding SMC 2022 || Entrée gratuite, le 11 juin 2022, au Fil (Saint-Étienne).";
    			t1 = space();
    			div = element("div");
    			p0 = element("p");
    			t2 = text("Ce concert est proposé dans le cadre des ");
    			a0 = element("a");
    			a0.textContent = "SMC 2022";
    			t4 = text(" (");
    			em0 = element("em");
    			em0.textContent = "Sound and Music Computing Conference";
    			t6 = text(") organisées par le laboratoire ECLLA de l'université Jean Monnet de Saint-Étienne, par le GRAME - Centre de Création Musicale, l'INRIA et autres partenaires institutionnels. Conçu en collaboration avec les parisiens du ");
    			a1 = element("a");
    			a1.textContent = "Cookie Collective";
    			t8 = text(", ce concert met en valeur le travail de la scène ");
    			em1 = element("em");
    			em1.textContent = "live-coding";
    			t10 = text(" stéphanoise, lyonnaise et plus largement francophone.");
    			t11 = space();
    			p1 = element("p");
    			t12 = text("Quatre performances musicales et visuelles d'une demi-heure chacune seront proposées par Ralt144Mi (Rémi Georges), azertype (Baya), Jules Cipher (Elie Gavoty), Léon Denise (");
    			em2 = element("em");
    			em2.textContent = "idem.";
    			t14 = text(") et Raphaël Forment (Bubobubo). Chacune présentera une approche singulière du ");
    			em3 = element("em");
    			em3.textContent = "live-coding";
    			t16 = text("; pratique que chaque musicien s'approprie selon son intérêt.");
    			attr_dev(h1, "class", "title svelte-1o77a36");
    			add_location(h1, file$1, 4, 4, 31);
    			attr_dev(a0, "href", "https://smc22.grame.fr/");
    			attr_dev(a0, "class", "svelte-1o77a36");
    			add_location(a0, file$1, 6, 66, 232);
    			add_location(em0, file$1, 6, 114, 280);
    			attr_dev(a1, "href", "https://cookie.paris/");
    			attr_dev(a1, "class", "svelte-1o77a36");
    			add_location(a1, file$1, 6, 379, 545);
    			add_location(em1, file$1, 6, 482, 648);
    			attr_dev(p0, "class", "words svelte-1o77a36");
    			add_location(p0, file$1, 6, 8, 174);
    			add_location(em2, file$1, 8, 198, 926);
    			add_location(em3, file$1, 8, 291, 1019);
    			attr_dev(p1, "class", "words svelte-1o77a36");
    			add_location(p1, file$1, 8, 8, 736);
    			attr_dev(div, "class", "explication svelte-1o77a36");
    			add_location(div, file$1, 5, 4, 140);
    			attr_dev(main, "class", "svelte-1o77a36");
    			add_location(main, file$1, 3, 0, 20);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(main, t1);
    			append_dev(main, div);
    			append_dev(div, p0);
    			append_dev(p0, t2);
    			append_dev(p0, a0);
    			append_dev(p0, t4);
    			append_dev(p0, em0);
    			append_dev(p0, t6);
    			append_dev(p0, a1);
    			append_dev(p0, t8);
    			append_dev(p0, em1);
    			append_dev(p0, t10);
    			append_dev(div, t11);
    			append_dev(div, p1);
    			append_dev(p1, t12);
    			append_dev(p1, em2);
    			append_dev(p1, t14);
    			append_dev(p1, em3);
    			append_dev(p1, t16);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MoreInformation', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MoreInformation> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class MoreInformation extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MoreInformation",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    const performers = [
        {
            pseudo: "BuboBubo",
            fullname: "Raphaël Forment",
            video: "/videos/Bubo.webm",
            link: "https://raphaelforment.fr",
            description: "Raphaël (bubobubo) est un live-coder actif à Lyon et à Paris. Il est actif au sein du collectif TOPLAP et du mouvement Algorave depuis 2018. Raphaël s'intéresse à l'utilisation du live coding comme technique, instrument et art performatif par son travail de recherche, son enseignement ou ses collaborations avec le collectif parisien Cookie Collective ou avec les lyonnais du LocalHost.",
            url_portrait: "/photos/lezgo.png",
            id: 1,
        },
        {
            pseudo: "Ralt144MI",
            fullname: "Rémi Georges",
            video: "/videos/ralt144mi.webm",
            link: "https://rhoumi.github.io/",
            description: "Ralt144MI est une bande sonore de souvenirs vidéos centrée sur un univers aquatique. C'est le résultat de la redécouverte d'un large stock de cassettes vidéos familiales de plongée sous-marine. Le son, codé en direct deviendra support des lectures de bandes, interagissant et évoluant avec elles.",
            url_portrait: "/photos/ralt144mi.jpeg",
            id: 2,
        },
        {
            pseudo: "Jules Cipher",
            fullname: "Elie Gavoty",
            video: "/videos/elie.webm",
            link: "https://linktr.ee/julescipher",
            description: "Frappé assez récemment par la passion du livecoding, Elie Gavoty (Jules Cipher), développe une pratique tournée notamment vers les microrythmes et l'usage de spatialisation pour tenter d'intensifier l'immersion d'une dance music improvisée et atypique.",
            url_portrait: "/photos/elie.JPG",
            id: 3,
        },
        {
            pseudo: "azertype", fullname: "Baya",
            video: "/videos/azertype.webm",
            link: "https://linktr.ee/azertype",
            description: "azertype Half-blood wizard Hardware: XY OS: bipolar & dys Software: anticapitalism & intersectionnality & neurodiversity Powered by Cyberflemme",
            url_portrait: "/photos/azertype.png",
            id: 4,
        },
        {
            pseudo: "Léon Denise",
            fullname: "Léon Denise",
            video: "/videos/leon.mp4",
            link: "https://leon196.github.io/",
            description: "Programmation d'effets visuels improvisées, entre sculptures fractals mathématiques, filtres d'images animés et distorsions de personnages 3D.",
            url_portrait: "/photos/photo_leon.png",
            id: 5,
        },
    ];

    var information = performers;

    /* src/App.svelte generated by Svelte v3.48.0 */
    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (38:4) <Tab>
    function create_default_slot_3(ctx) {
    	let t_value = /*p*/ ctx[2].pseudo + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(38:4) <Tab>",
    		ctx
    	});

    	return block;
    }

    // (37:3) {#each shuffled as p}
    function create_each_block_1(ctx) {
    	let tab;
    	let current;

    	tab = new Tab({
    			props: {
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tab.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tab, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tab_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				tab_changes.$$scope = { dirty, ctx };
    			}

    			tab.$set(tab_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tab.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tab.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tab, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(37:3) {#each shuffled as p}",
    		ctx
    	});

    	return block;
    }

    // (36:2) <TabList>
    function create_default_slot_2(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_1 = /*shuffled*/ ctx[0];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*shuffled*/ 1) {
    				each_value_1 = /*shuffled*/ ctx[0];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(36:2) <TabList>",
    		ctx
    	});

    	return block;
    }

    // (43:3) <TabPanel>
    function create_default_slot_1(ctx) {
    	let performerdescription;
    	let t;
    	let current;

    	performerdescription = new PerformerDescription({
    			props: {
    				name: /*p*/ ctx[2].pseudo,
    				url_portrait: /*p*/ ctx[2].url_portrait,
    				pseudo: /*p*/ ctx[2].fullname,
    				link: /*p*/ ctx[2].link,
    				description: /*p*/ ctx[2].description,
    				video: /*p*/ ctx[2].video
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(performerdescription.$$.fragment);
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			mount_component(performerdescription, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(performerdescription.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(performerdescription.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(performerdescription, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(43:3) <TabPanel>",
    		ctx
    	});

    	return block;
    }

    // (42:2) {#each shuffled as p}
    function create_each_block(ctx) {
    	let tabpanel;
    	let current;

    	tabpanel = new TabPanel({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tabpanel.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tabpanel, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tabpanel_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				tabpanel_changes.$$scope = { dirty, ctx };
    			}

    			tabpanel.$set(tabpanel_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tabpanel.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tabpanel.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tabpanel, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(42:2) {#each shuffled as p}",
    		ctx
    	});

    	return block;
    }

    // (35:1) <Tabs>
    function create_default_slot(ctx) {
    	let tablist;
    	let t;
    	let each_1_anchor;
    	let current;

    	tablist = new TabList({
    			props: {
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let each_value = /*shuffled*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			create_component(tablist.$$.fragment);
    			t = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			mount_component(tablist, target, anchor);
    			insert_dev(target, t, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tablist_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				tablist_changes.$$scope = { dirty, ctx };
    			}

    			tablist.$set(tablist_changes);

    			if (dirty & /*shuffled*/ 1) {
    				each_value = /*shuffled*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tablist.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tablist.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tablist, detaching);
    			if (detaching) detach_dev(t);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(35:1) <Tabs>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let header;
    	let h1;
    	let t1;
    	let h20;
    	let t3;
    	let h21;
    	let t5;
    	let div0;
    	let h22;
    	let t7;
    	let h23;
    	let t9;
    	let div1;
    	let img0;
    	let img0_src_value;
    	let t10;
    	let img1;
    	let img1_src_value;
    	let t11;
    	let img2;
    	let img2_src_value;
    	let t12;
    	let tabs;
    	let t13;
    	let moreinformation;
    	let current;

    	tabs = new Tabs({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	moreinformation = new MoreInformation({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			header = element("header");
    			h1 = element("h1");
    			h1.textContent = `${/*all_titles*/ ctx[1][Math.floor(Math.random() * 3)]}`;
    			t1 = space();
    			h20 = element("h2");
    			h20.textContent = "Programmation improvisée à la volée Improvisation musicale cybernétique";
    			t3 = space();
    			h21 = element("h2");
    			h21.textContent = "Computer Music, Synthèse de systèmes, Musique DIY";
    			t5 = space();
    			div0 = element("div");
    			h22 = element("h2");
    			h22.textContent = "11 juin, Le Fil, Saint-Étienne.";
    			t7 = space();
    			h23 = element("h2");
    			h23.textContent = "22h00 -- 00h00, Entrée gratuite.";
    			t9 = space();
    			div1 = element("div");
    			img0 = element("img");
    			t10 = space();
    			img1 = element("img");
    			t11 = space();
    			img2 = element("img");
    			t12 = space();
    			create_component(tabs.$$.fragment);
    			t13 = space();
    			create_component(moreinformation.$$.fragment);
    			attr_dev(h1, "class", "bigtitle svelte-1c2yk31");
    			add_location(h1, file, 19, 2, 479);
    			attr_dev(h20, "class", "subtitle svelte-1c2yk31");
    			add_location(h20, file, 20, 2, 551);
    			attr_dev(h21, "class", "subtitle svelte-1c2yk31");
    			add_location(h21, file, 21, 2, 651);
    			attr_dev(h22, "class", "venuedate svelte-1c2yk31");
    			add_location(h22, file, 23, 3, 759);
    			attr_dev(h23, "class", "precision svelte-1c2yk31");
    			add_location(h23, file, 24, 3, 821);
    			attr_dev(div0, "class", "information svelte-1c2yk31");
    			add_location(div0, file, 22, 2, 730);
    			attr_dev(header, "class", "svelte-1c2yk31");
    			add_location(header, file, 18, 1, 468);
    			if (!src_url_equal(img0.src, img0_src_value = "/photos/couleur_jaune.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "poster1");
    			attr_dev(img0, "class", "svelte-1c2yk31");
    			add_location(img0, file, 29, 2, 927);
    			if (!src_url_equal(img1.src, img1_src_value = "/photos/couleur_orange.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "poster2");
    			attr_dev(img1, "class", "svelte-1c2yk31");
    			add_location(img1, file, 30, 2, 981);
    			if (!src_url_equal(img2.src, img2_src_value = "/photos/couleur_bleu.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "poster3");
    			attr_dev(img2, "class", "svelte-1c2yk31");
    			add_location(img2, file, 31, 2, 1036);
    			attr_dev(div1, "class", "posters svelte-1c2yk31");
    			add_location(div1, file, 28, 1, 903);
    			attr_dev(main, "class", "svelte-1c2yk31");
    			add_location(main, file, 17, 0, 460);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, header);
    			append_dev(header, h1);
    			append_dev(header, t1);
    			append_dev(header, h20);
    			append_dev(header, t3);
    			append_dev(header, h21);
    			append_dev(header, t5);
    			append_dev(header, div0);
    			append_dev(div0, h22);
    			append_dev(div0, t7);
    			append_dev(div0, h23);
    			append_dev(main, t9);
    			append_dev(main, div1);
    			append_dev(div1, img0);
    			append_dev(div1, t10);
    			append_dev(div1, img1);
    			append_dev(div1, t11);
    			append_dev(div1, img2);
    			append_dev(main, t12);
    			mount_component(tabs, main, null);
    			append_dev(main, t13);
    			mount_component(moreinformation, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const tabs_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				tabs_changes.$$scope = { dirty, ctx };
    			}

    			tabs.$set(tabs_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tabs.$$.fragment, local);
    			transition_in(moreinformation.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tabs.$$.fragment, local);
    			transition_out(moreinformation.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(tabs);
    			destroy_component(moreinformation);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let shuffled = information.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
    	let all_titles = ["LIVE-CODING", "ALGORAVE", "ON THE FLY"];
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Tabs,
    		TabList,
    		TabPanel,
    		Tab,
    		PerformerDescription,
    		MoreInformation,
    		performers: information,
    		shuffled,
    		all_titles
    	});

    	$$self.$inject_state = $$props => {
    		if ('shuffled' in $$props) $$invalidate(0, shuffled = $$props.shuffled);
    		if ('all_titles' in $$props) $$invalidate(1, all_titles = $$props.all_titles);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [shuffled, all_titles];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map