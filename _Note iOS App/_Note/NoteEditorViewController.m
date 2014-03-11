//
//  DetailViewController.m
//  _Note
//
//  Created by Lyndon Quigley on 2/4/2014.
//  Copyright (c) 2014 Lyndon Quigley. All rights reserved.
//

#import "NoteEditorViewController.h"

#import "Note.h"
#import <DropboxSDK/DropboxSDK.h>

@interface NoteEditorViewController () <UITextViewDelegate, DBRestClientDelegate>
@property (strong, nonatomic) UIPopoverController *masterPopoverController;
@property (weak, nonatomic) IBOutlet UITextView *textView;
@property (weak, nonatomic) IBOutlet UITextView *noteTitle;
@property (nonatomic, strong) DBRestClient *restClient;

@property NSURLConnection *urlConnection;
@property NSURLRequest *request;
@property BOOL authenticated;

- (void)configureView;
@end

@implementation NoteEditorViewController

#pragma mark - Managing the detail item

- (void)setDetailItem:(id)newDetailItem
{
    if (_detailItem != newDetailItem) {
        _detailItem = newDetailItem;
        
        // Update the view.
        [self configureView];
    }

    if (self.masterPopoverController != nil) {
        [self.masterPopoverController dismissPopoverAnimated:YES];
    }        
}

- (void)configureView
{
    // Update the user interface for the detail item.

    if (self.detailItem) {
        self.detailDescriptionLabel.text = [self.detailItem description];
    }
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    NSString *writeTest = @"<html>Writing <b>for</b> <i>testing</i><ul><li>Hey</li><li>Hey</li></ul></html>";
    NSURL *htmlString = [[NSBundle mainBundle] URLForResource:@"temporary" withExtension:@"html"];
    [writeTest writeToFile:htmlString atomically:YES encoding:NSUTF8StringEncoding error:nil];
    NSAttributedString *stringWithHTMLAttributes = [[NSAttributedString alloc]
                                                    initWithFileURL:htmlString
                                                    options:@{NSDocumentTypeDocumentAttribute:
                                                                  NSHTMLTextDocumentType} documentAttributes:nil
                                                    error:nil];
    
	// Do any additional setup after loading the view, typically from a nib.
    self.noteTitle.text = self.note.title;
    self.noteTitle.delegate = self;
    //self.textView.text = self.note.contents;
    self.textView.attributedText = stringWithHTMLAttributes;
    self.textView.delegate = self;
    //self.textView.font = [UIFont preferredFontForTextStyle:UIFontTextStyleBody];
    
    // Dropbox Auth Session
    self.restClient = [[DBRestClient alloc] initWithSession:[DBSession sharedSession]];
    self.restClient.delegate = self;
    
    NSString *urlString = @"https://localhost:5000/dropbox-auth-start";
    NSURL *url = [NSURL URLWithString:urlString];
    
    NSMutableURLRequest *urlRequest = [NSMutableURLRequest requestWithURL:url];
    NSURLRequest *requestObj = [NSURLRequest requestWithURL:url    cachePolicy:NSURLRequestReturnCacheDataElseLoad timeoutInterval:10.0];
    
    [self.urlConnection = [NSURLConnection alloc] initWithRequest:urlRequest delegate:self startImmediately:YES];
    [self.web loadRequest:requestObj];
    _web.hidden = YES;

    [self configureView];
}

- (void)textViewDidEndEditing:(UITextView *)textView
{
    // copy the updated note text to the underlying model.
    switch(textView.tag){
        case 0:
            _note.contents = textView.text;
            break;
        case 1:
            if ((_noteTitle.text).length > 0){
                _note.titleString = _noteTitle.text;
                _note.setTitle = YES;
            } else {
                _noteTitle.text = _note.title;
            }
            break;
    }
}

// Change button icon to reflect Dropbox Authentication Status
- (IBAction)checkLink : (id) sender {
    UIButton *button = (UIButton *) sender;
    if ([[DBSession sharedSession] isLinked]) {
        [button setTitle:@"Unlinked. Relink?" forState:UIControlStateNormal];
    } else {
        [button setTitle:@"Link to Dropbox" forState:UIControlStateNormal];
    }
}

// Establish Dropbox Authentication
- (IBAction)didPressLink{
    if (![[DBSession sharedSession] isLinked]) {
        [[DBSession sharedSession] linkFromController:self];
    } else {
        [[DBSession sharedSession] unlinkAll];
    }
}

// Get list of notes from server JSON
- (IBAction)loadNotes{
    
    // HTTP request to server
    NSString *urlString = @"https://localhost:5000/lists";
    NSURL *url = [NSURL URLWithString:urlString];
    
    NSMutableURLRequest *urlRequest = [NSMutableURLRequest requestWithURL:url];
    NSURLRequest *requestObj = [NSURLRequest requestWithURL:url    cachePolicy:NSURLRequestReturnCacheDataElseLoad timeoutInterval:10.0];
    
    [self.urlConnection = [NSURLConnection alloc] initWithRequest:urlRequest delegate:self startImmediately:YES];
    [self.web loadRequest:requestObj];
    _web.hidden = NO;
}

- (IBAction)viewNoteLink{
    
    self.restClient = [[DBRestClient alloc] initWithSession:[DBSession sharedSession]];
    self.restClient.delegate = self;
    
    [self.restClient loadMetadata:@"/"];
}

/*
- (void)textFieldDidEndEditing:(UITextField *)noteTitle
{
    NSLog(@"Got here");
    if ((noteTitle.text).length > 0){
        _note.titleString = noteTitle.text;
        _note.setTitle = YES;
    } else {
        noteTitle.text = _note.title;
    }
}
*/

- (void)restClient:(DBRestClient *)client loadedMetadata:(DBMetadata *)metadata {
    if (metadata.isDirectory) {
        NSLog(@"Folder '%@' contains:", metadata.path);
        for (DBMetadata *file in metadata.contents) {
            NSLog(@"	%@", file.filename);
        }
    }
}

- (void)restClient:(DBRestClient *)client
loadMetadataFailedWithError:(NSError *)error {
    NSLog(@"Error loading metadata: %@", error);
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

#pragma mark - Split view

- (void)splitViewController:(UISplitViewController *)splitController willHideViewController:(UIViewController *)viewController withBarButtonItem:(UIBarButtonItem *)barButtonItem forPopoverController:(UIPopoverController *)popoverController
{
    barButtonItem.title = NSLocalizedString(@"Your Notes", @"Your Notes");
    [self.navigationItem setLeftBarButtonItem:barButtonItem animated:YES];
    self.masterPopoverController = popoverController;
}

- (void)splitViewController:(UISplitViewController *)splitController willShowViewController:(UIViewController *)viewController invalidatingBarButtonItem:(UIBarButtonItem *)barButtonItem
{
    // Called when the view is shown again in the split view, invalidating the button and popover controller.
    [self.navigationItem setLeftBarButtonItem:nil animated:YES];
    self.masterPopoverController = nil;
}

#pragma mark Webview delegate
// Note: This method is particularly important. As the server is using a self signed certificate,
// we cannot use just UIWebView - as it doesn't allow for using self-certs. Instead, we stop the
// request in this method below, create an NSURLConnection (which can allow self-certs via the delegate methods
// which UIWebView does not have), authenticate using NSURLConnection, then use another UIWebView to complete
// the loading and viewing of the page. See connection:didReceiveAuthenticationChallenge to see how this works.
- (BOOL)webView:(UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType;
{
    NSLog(@"Did start loading: %@ auth:%d", [[request URL] absoluteString], _authenticated);
    
    if (!_authenticated) {
        _authenticated = NO;
        
        _urlConnection = [[NSURLConnection alloc] initWithRequest:_request delegate:self];
        
        [_urlConnection start];
        
        return NO;
    }
    
    return YES;
}


#pragma mark - NURLConnection delegate

- (void)connection:(NSURLConnection *)connection didReceiveAuthenticationChallenge:(NSURLAuthenticationChallenge *)challenge;
{
    NSLog(@"WebController Got auth challange via NSURLConnection");
    
    if ([challenge previousFailureCount] == 0)
    {
        _authenticated = YES;
        
        NSURLCredential *credential = [NSURLCredential credentialForTrust:challenge.protectionSpace.serverTrust];
        
        [challenge.sender useCredential:credential forAuthenticationChallenge:challenge];
        
    } else
    {
        [[challenge sender] cancelAuthenticationChallenge:challenge];
    }
}

- (void)connection:(NSURLConnection *)connection didReceiveResponse:(NSURLResponse *)response;
{
    NSLog(@"WebController received response via NSURLConnection");
    
    // remake a webview call now that authentication has passed ok.
    _authenticated = YES;
    [_web loadRequest:_request];
    
    // Cancel the URL connection otherwise we double up (webview + url connection, same url = no good!)
    [_urlConnection cancel];
}

// We use this method is to accept an untrusted site which unfortunately we need to do, as our PVM servers are self signed.
- (BOOL)connection:(NSURLConnection *)connection canAuthenticateAgainstProtectionSpace:(NSURLProtectionSpace *)protectionSpace
{
    return [protectionSpace.authenticationMethod isEqualToString:NSURLAuthenticationMethodServerTrust];
}
@end
